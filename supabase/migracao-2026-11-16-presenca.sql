-- Migração de 16/11/2026: presença no evento comprovada pelo celular (estilo "ponto móvel").
-- Check-in automático pelo GPS quando o aluno abre o app no local e no horário do evento,
-- foto de evidência tirada na hora e registro da saída. Rodar DEPOIS de migracao-2026-11-16-eventos-abertos.sql.
-- É seguro rodar mais de uma vez.
--
-- Privacidade (LGPD): o banco NÃO guarda as coordenadas do aluno, só a distância até o local e a
-- precisão do GPS. A foto fica em pasta privada; quem vê: o próprio aluno, quem organiza o evento,
-- a coordenação do curso, o admin e a secretaria (só de quem autorizou o compartilhamento).

-- 1) Onde o evento acontece --------------------------------------------------------
alter table public.events add column if not exists geo_lat double precision check (geo_lat between -90 and 90);
alter table public.events add column if not exists geo_lng double precision check (geo_lng between -180 and 180);
alter table public.events add column if not exists geo_radius_m int not null default 200 check (geo_radius_m between 50 and 1000);

-- 2) Registro de presença ----------------------------------------------------------
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_at timestamptz not null default now(),
  checkin_auto boolean not null default false,
  checkin_distance_m int,
  checkin_accuracy_m int,
  last_seen_at timestamptz,
  last_distance_m int,
  checkout_at timestamptz,
  pings int not null default 1,
  photo_path text,
  photo_at timestamptz,
  receipt_code text not null unique default upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index if not exists attendance_event on public.attendance (event_id);

-- 3) Funções de apoio -------------------------------------------------------------
create or replace function public.geo_distance_m(lat1 float8, lng1 float8, lat2 float8, lng2 float8) returns float8
language sql immutable set search_path = public as $$
  select 2 * 6371000 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2)
    + cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)))
$$;

-- janela do check-in: 30 min antes do início até 30 min depois do fim
create or replace function public.checkin_opens(p_starts timestamptz) returns timestamptz
language sql immutable as $$ select p_starts - interval '30 minutes' $$;
create or replace function public.checkin_closes(p_starts timestamptz, p_ends timestamptz, p_hours numeric) returns timestamptz
language sql immutable as $$
  select coalesce(p_ends, p_starts + greatest(1, coalesce(p_hours, 1))::float8 * interval '1 hour') + interval '30 minutes'
$$;

-- quem pode ver a presença de um evento (fora o próprio aluno)
create or replace function public.can_manage_attendance(p_event uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.events e
    where e.id = p_event
      and (e.organizer_id = auth.uid() or public.is_admin() or public.i_coordinate(e.institution_id, e.courses)))
$$;

-- 4) Check-in, sinal de presença e saída (tudo passa por aqui; ninguém grava direto na tabela) ---
create or replace function public.attendance_ping(p_event uuid, p_lat float8, p_lng float8, p_accuracy float8, p_mode text default 'manual')
returns public.attendance
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  e public.events;
  a public.attendance;
  acc float8 := greatest(coalesce(p_accuracy, 9999), 0);
  d float8;
  raio int;
  inside boolean;
begin
  if me is null then raise exception 'Faça login para registrar presença.'; end if;
  if p_mode not in ('auto', 'manual', 'checkout') then raise exception 'Modo inválido.'; end if;
  select * into e from public.events where id = p_event and status = 'approved';
  if not found then raise exception 'Evento não encontrado.'; end if;
  if e.geo_lat is null or e.geo_lng is null then raise exception 'Este evento não tem check-in por localização.'; end if;
  if now() < public.checkin_opens(e.starts_at) then
    raise exception 'O check-in abre 30 minutos antes do início (%).', to_char(public.checkin_opens(e.starts_at) at time zone 'America/Sao_Paulo', 'DD/MM "às" HH24:MI');
  end if;
  if now() > public.checkin_closes(e.starts_at, e.ends_at, e.hours) then raise exception 'O check-in deste evento já encerrou.'; end if;
  if p_lat is null or p_lng is null or abs(p_lat) > 90 or abs(p_lng) > 180 then raise exception 'Localização inválida.'; end if;
  if acc > 1000 then
    raise exception 'O GPS está impreciso (± % m). Ative a localização precisa do celular e tente de novo.', round(acc);
  end if;

  raio := coalesce(e.geo_radius_m, 200);
  d := public.geo_distance_m(e.geo_lat, e.geo_lng, p_lat, p_lng);
  inside := d <= raio + least(acc, 100);

  select * into a from public.attendance where event_id = p_event and user_id = me;
  if not found then
    if not inside then
      raise exception 'Você está a % m do local do evento. O check-in funciona a até % m.', round(d), raio;
    end if;
    insert into public.attendance (event_id, user_id, checkin_auto, checkin_distance_m, checkin_accuracy_m, last_seen_at, last_distance_m)
    values (p_event, me, p_mode = 'auto', round(d), round(acc), now(), round(d))
    returning * into a;
    return a;
  end if;

  if inside then
    -- no máximo um sinal a cada 30 s (o app manda a cada poucos minutos enquanto está aberto)
    if p_mode <> 'checkout' and a.last_seen_at > now() - interval '30 seconds' then return a; end if;
    update public.attendance
      set last_seen_at = now(), last_distance_m = round(d), pings = pings + 1,
          checkout_at = case when p_mode = 'checkout' then now() when p_mode = 'manual' then null else checkout_at end
      where id = a.id returning * into a;
  elsif p_mode = 'checkout' then
    -- saiu do local: a saída vale o último horário em que o app confirmou a presença no local
    update public.attendance set checkout_at = coalesce(checkout_at, last_seen_at) where id = a.id returning * into a;
  else
    raise exception 'Você está a % m do local. O check-in funciona a até % m.', round(d), raio;
  end if;
  return a;
end $$;

-- foto de evidência: tirada durante o evento, depois do check-in, na pasta do próprio aluno
create or replace function public.attendance_set_photo(p_event uuid, p_path text) returns public.attendance
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  e public.events;
  a public.attendance;
begin
  if me is null then raise exception 'Faça login para continuar.'; end if;
  select * into a from public.attendance where event_id = p_event and user_id = me;
  if not found then raise exception 'Faça o check-in antes de enviar a foto.'; end if;
  select * into e from public.events where id = p_event;
  if now() > public.checkin_closes(e.starts_at, e.ends_at, e.hours) then raise exception 'O prazo para a foto deste evento já encerrou.'; end if;
  if p_path is null or split_part(p_path, '/', 1) <> me::text or split_part(p_path, '/', 2) <> p_event::text then
    raise exception 'Arquivo inválido.';
  end if;
  if not exists (select 1 from storage.objects where bucket_id = 'attendance-photos' and name = p_path) then
    raise exception 'Foto não encontrada. Tente enviar de novo.';
  end if;
  update public.attendance set photo_path = p_path, photo_at = now() where id = a.id returning * into a;
  return a;
end $$;

-- lista de presença para quem organiza, coordenação e admin (com nome e e-mail para emitir o certificado)
create or replace function public.event_attendance(p_event uuid)
returns table (id uuid, user_id uuid, name text, email text, institution_id text, course_id text,
               checkin_at timestamptz, checkin_auto boolean, checkin_distance_m int, checkin_accuracy_m int,
               last_seen_at timestamptz, checkout_at timestamptz, photo_path text, photo_at timestamptz, receipt_code text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.can_manage_attendance(p_event) then
    raise exception 'Você não pode ver a lista de presença deste evento.';
  end if;
  return query
    select a.id, a.user_id, p.name, p.email, p.institution_id, p.course_id,
           a.checkin_at, a.checkin_auto, a.checkin_distance_m, a.checkin_accuracy_m,
           a.last_seen_at, a.checkout_at, a.photo_path, a.photo_at, a.receipt_code
    from public.attendance a join public.profiles p on p.id = a.user_id
    where a.event_id = p_event
    order by a.checkin_at;
end $$;

revoke execute on function public.attendance_ping(uuid, float8, float8, float8, text) from public, anon;
revoke execute on function public.attendance_set_photo(uuid, text) from public, anon;
revoke execute on function public.event_attendance(uuid) from public, anon;
revoke execute on function public.can_manage_attendance(uuid) from public, anon;
grant execute on function public.attendance_ping(uuid, float8, float8, float8, text) to authenticated;
grant execute on function public.attendance_set_photo(uuid, text) to authenticated;
grant execute on function public.event_attendance(uuid) to authenticated;
grant execute on function public.can_manage_attendance(uuid) to authenticated;

-- 5) Permissões da tabela ----------------------------------------------------------
alter table public.attendance enable row level security;
drop policy if exists "presença: o próprio aluno vê" on public.attendance;
create policy "presença: o próprio aluno vê" on public.attendance
  for select to authenticated using (user_id = auth.uid());
drop policy if exists "presença: organização do evento vê" on public.attendance;
create policy "presença: organização do evento vê" on public.attendance
  for select to authenticated using (public.can_manage_attendance(event_id));
drop policy if exists "presença: secretaria vê quem autorizou" on public.attendance;
create policy "presença: secretaria vê quem autorizou" on public.attendance
  for select to authenticated using (public.secretaria_sees(user_id));
drop policy if exists "presença: o próprio aluno apaga" on public.attendance;
create policy "presença: o próprio aluno apaga" on public.attendance
  for delete to authenticated using (user_id = auth.uid());
-- sem insert/update diretos: só pelas funções acima

-- 6) Fotos de evidência (pasta privada) ----------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('attendance-photos', 'attendance-photos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_view_attendance_photo(p_name text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.attendance a
    where a.photo_path = p_name
      and (a.user_id = auth.uid() or public.can_manage_attendance(a.event_id) or public.secretaria_sees(a.user_id)))
$$;
revoke execute on function public.can_view_attendance_photo(text) from public, anon;
grant execute on function public.can_view_attendance_photo(text) to authenticated;

drop policy if exists "presença: aluno envia a foto" on storage.objects;
create policy "presença: aluno envia a foto" on storage.objects for insert to authenticated
  with check (bucket_id = 'attendance-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "presença: ver a foto" on storage.objects;
create policy "presença: ver a foto" on storage.objects for select to authenticated
  using (bucket_id = 'attendance-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.can_view_attendance_photo(name)));
drop policy if exists "presença: aluno apaga a foto" on storage.objects;
create policy "presença: aluno apaga a foto" on storage.objects for delete to authenticated
  using (bucket_id = 'attendance-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 7) Mudar o local (coordenadas ou raio) também volta o evento para aprovação ---------------
create or replace function public.guard_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if current_setting('ah.bypass', true) = 'on' or auth.uid() is null then
    return new; -- funções de aprovação e SQL Editor
  end if;

  if public.is_admin() then
    if tg_op = 'INSERT' then
      if new.organizer_name is null then
        select coalesce(org_name, name) into new.organizer_name from public.profiles where id = new.organizer_id;
      end if;
      new.admin_approved_at := now();
      new.admin_approved_by := auth.uid();
      new.coord_approved_at := null;
      new.coord_approved_by := null;
      new.status := case when public.event_has_coordinator(new.institution_id, new.courses) then 'pending' else 'approved' end;
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.organizer_id := auth.uid();
    new.status := 'pending';
    new.reject_reason := null;
    new.admin_approved_at := null; new.admin_approved_by := null;
    new.coord_approved_at := null; new.coord_approved_by := null;
    if new.boost_status not in ('none', 'requested') then new.boost_status := 'none'; end if;
    new.boost_until := null;
    new.views := 0;
    new.link_clicks := 0;
    new.is_example := false;
    new.organizer_name := left(coalesce(nullif(trim(new.organizer_name), ''),
      (select coalesce(org_name, name) from public.profiles where id = auth.uid())), 120);
    return new;
  end if;

  new.organizer_id := old.organizer_id;
  new.organizer_name := old.organizer_name;
  new.views := old.views;
  new.link_clicks := old.link_clicks;
  new.boost_until := old.boost_until;
  new.is_example := old.is_example;
  new.created_at := old.created_at;
  if new.boost_status = 'active' and old.boost_status <> 'active' then
    new.boost_status := 'requested';
  end if;
  if (new.title, new.description, new.category, new.hours, new.starts_at, new.ends_at, new.location,
      new.address, new.city, new.price, new.link, new.image_url, new.courses, new.capacity, new.requirements, new.institution_id,
      new.cert_issuer, new.cert_signer_name, new.cert_signer_role, new.cert_participation, new.cert_delivery,
      new.geo_lat, new.geo_lng, new.geo_radius_m)
     is distinct from
     (old.title, old.description, old.category, old.hours, old.starts_at, old.ends_at, old.location,
      old.address, old.city, old.price, old.link, old.image_url, old.courses, old.capacity, old.requirements, old.institution_id,
      old.cert_issuer, old.cert_signer_name, old.cert_signer_role, old.cert_participation, old.cert_delivery,
      old.geo_lat, old.geo_lng, old.geo_radius_m) then
    new.status := 'pending';
    new.reject_reason := null;
    new.admin_approved_at := null; new.admin_approved_by := null;
    new.coord_approved_at := null; new.coord_approved_by := null;
  else
    new.status := old.status;
    new.reject_reason := old.reject_reason;
    new.admin_approved_at := old.admin_approved_at; new.admin_approved_by := old.admin_approved_by;
    new.coord_approved_at := old.coord_approved_at; new.coord_approved_by := old.coord_approved_by;
  end if;
  return new;
end $$;

-- 8) Local dos eventos já publicados no IELUSC Campus Centro (Rua Princesa Isabel, 438; OpenStreetMap)
update public.events set geo_lat = -26.2993229, geo_lng = -48.8468081, geo_radius_m = 200
where location ilike 'IELUSC Campus Centro%' and geo_lat is null;

notify pgrst, 'reload schema';

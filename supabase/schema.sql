-- ============================================================================
-- Àquelas Horas · banco de dados (Supabase)
-- Como usar: no painel do Supabase, abra SQL Editor > New query, cole este
-- arquivo inteiro e clique em Run. Pode rodar de novo sem quebrar nada.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- PERFIS
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'student' check (role in ('student', 'organizer', 'admin')),
  institution_id text,
  course_id text,
  semester int check (semester between 1 and 12),
  goal_hours int check (goal_hours between 0 and 2000),
  onboarded boolean not null default false,
  org_name text,
  org_instagram text,
  org_bio text,
  org_status text check (org_status in ('pending', 'approved', 'rejected')),
  accepted_terms_at timestamptz,
  institution_type text check (institution_type in ('faculdade', 'universidade', 'centro_universitario')),
  institution_name text,
  password_set boolean not null default false, -- false = ainda usa a data de nascimento como senha
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- para quem rodou uma versão anterior deste arquivo
alter table public.profiles add column if not exists institution_type text
  check (institution_type in ('faculdade', 'universidade', 'centro_universitario'));
alter table public.profiles add column if not exists institution_name text;
alter table public.profiles add column if not exists entry_year smallint check (entry_year between 2000 and 2100);
alter table public.profiles add column if not exists password_set boolean not null default false;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, left(coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1)), 120))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- impede que o próprio usuário vire admin ou se aprove como organizador
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if auth.uid() is null or public.is_admin() then
    return new; -- SQL Editor, service role ou admin
  end if;
  new.id := old.id;
  new.email := old.email;
  new.created_at := old.created_at;
  if new.role = 'admin' and old.role <> 'admin' then
    new.role := old.role;
  end if;
  if new.role is distinct from old.role then
    new.org_status := case when new.role = 'organizer' then 'pending' else null end;
  else
    new.org_status := old.org_status;
    -- organizador aprovado que muda o nome da organização volta para análise
    if new.role = 'organizer' and new.org_name is distinct from old.org_name and old.org_name is not null then
      new.org_status := 'pending';
    end if;
  end if;
  -- data de aceite dos termos (LGPD): o servidor grava, ninguém reescreve depois
  if old.accepted_terms_at is not null then
    new.accepted_terms_at := old.accepted_terms_at;
  elsif new.accepted_terms_at is not null then
    new.accepted_terms_at := now();
  end if;
  return new;
end $$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile();

alter table public.profiles enable row level security;
drop policy if exists "perfil: ver o próprio ou admin" on public.profiles;
create policy "perfil: ver o próprio ou admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "perfil: editar o próprio ou admin" on public.profiles;
create policy "perfil: editar o próprio ou admin" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- EVENTOS
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  organizer_name text,
  title text not null check (char_length(title) between 3 and 140),
  description text check (char_length(description) <= 5000),
  category text not null default 'outros',
  hours numeric(6,1) not null default 0 check (hours >= 0 and hours <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  address text,
  city text default 'Joinville',
  price numeric(10,2) default 0 check (price >= 0), -- vazio = valor a confirmar
  link text,
  image_url text,
  courses text[] not null default '{}',
  capacity int check (capacity > 0),
  requirements text[] not null default '{}',
  cert_issuer text,           -- instituição que aparece no certificado
  cert_signer_name text,      -- quem assina (com titulação)
  cert_signer_role text,      -- cargo de quem assina
  cert_participation text,    -- participou, organizou, apresentou, ministrou, concluiu
  cert_delivery text,         -- como e quando o certificado é entregue
  institution_id text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reject_reason text,
  boost_status text not null default 'none' check (boost_status in ('none', 'requested', 'active')),
  boost_until timestamptz,
  views int not null default 0,
  link_clicks int not null default 0,
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- para quem rodou uma versão anterior deste arquivo
alter table public.events add column if not exists capacity int check (capacity > 0);
alter table public.events add column if not exists requirements text[] not null default '{}';
alter table public.events alter column price drop not null;
alter table public.events add column if not exists cert_issuer text;
alter table public.events add column if not exists cert_signer_name text;
alter table public.events add column if not exists cert_signer_role text;
alter table public.events add column if not exists cert_participation text;
alter table public.events add column if not exists cert_delivery text;

create index if not exists events_status_start on public.events (status, starts_at);
create index if not exists events_organizer on public.events (organizer_id);

-- organizador não aprova o próprio evento, não liga destaque pago e não mexe em contadores
create or replace function public.guard_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if auth.uid() is null or public.is_admin() or current_setting('ah.bypass', true) = 'on' then
    if tg_op = 'INSERT' and new.organizer_name is null then
      select coalesce(org_name, name) into new.organizer_name from public.profiles where id = new.organizer_id;
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.organizer_id := auth.uid();
    new.status := 'pending';
    new.reject_reason := null;
    if new.boost_status not in ('none', 'requested') then new.boost_status := 'none'; end if;
    new.boost_until := null;
    new.views := 0;
    new.link_clicks := 0;
    new.is_example := false;
    select coalesce(org_name, name) into new.organizer_name from public.profiles where id = auth.uid();
    return new;
  end if;

  -- UPDATE feito pelo organizador
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
      new.cert_issuer, new.cert_signer_name, new.cert_signer_role, new.cert_participation, new.cert_delivery)
     is distinct from
     (old.title, old.description, old.category, old.hours, old.starts_at, old.ends_at, old.location,
      old.address, old.city, old.price, old.link, old.image_url, old.courses, old.capacity, old.requirements, old.institution_id,
      old.cert_issuer, old.cert_signer_name, old.cert_signer_role, old.cert_participation, old.cert_delivery) then
    new.status := 'pending'; -- editou o conteúdo: volta para revisão
    new.reject_reason := null;
  else
    new.status := old.status;
    new.reject_reason := old.reject_reason;
  end if;
  return new;
end $$;

drop trigger if exists events_guard on public.events;
create trigger events_guard before insert or update on public.events
  for each row execute function public.guard_event();

alter table public.events enable row level security;
drop policy if exists "evento: aprovados são públicos" on public.events;
create policy "evento: aprovados são públicos" on public.events
  for select to anon, authenticated
  using (status = 'approved' or organizer_id = auth.uid() or public.is_admin());
drop policy if exists "evento: organizador aprovado cria" on public.events;
create policy "evento: organizador aprovado cria" on public.events
  for insert to authenticated
  with check (
    public.is_admin()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'organizer' and p.org_status = 'approved')
  );
drop policy if exists "evento: dono ou admin edita" on public.events;
create policy "evento: dono ou admin edita" on public.events
  for update to authenticated
  using (organizer_id = auth.uid() or public.is_admin())
  with check (organizer_id = auth.uid() or public.is_admin());
drop policy if exists "evento: dono ou admin apaga" on public.events;
create policy "evento: dono ou admin apaga" on public.events
  for delete to authenticated using (organizer_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- "VOU" E "SALVAR"
-- ---------------------------------------------------------------------------
create table if not exists public.interactions (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  kind text not null check (kind in ('going', 'saved')),
  created_at timestamptz not null default now(),
  primary key (user_id, event_id, kind)
);
alter table public.interactions enable row level security;
drop policy if exists "interação: só as próprias" on public.interactions;
create policy "interação: só as próprias" on public.interactions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- contagem pública (sem expor quem marcou)
create or replace function public.event_counts()
returns table (event_id uuid, going bigint, saved bigint)
language sql stable security definer set search_path = public as $$
  select i.event_id,
         count(*) filter (where i.kind = 'going') as going,
         count(*) filter (where i.kind = 'saved') as saved
  from public.interactions i
  join public.events e on e.id = i.event_id and e.status = 'approved'
  group by i.event_id;
$$;
grant execute on function public.event_counts() to anon, authenticated;

-- visualizações e cliques no link de inscrição: só conta usuário logado, uma vez por dia
-- (impede inflar a "prova de tração" com um robô usando a chave pública)
create table if not exists public.event_hits (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('view', 'click')),
  day date not null default current_date,
  primary key (event_id, user_id, kind, day)
);
alter table public.event_hits enable row level security; -- sem policies: só a função escreve

create or replace function public.track_event(p_event uuid, p_kind text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or p_kind not in ('view', 'click') then return; end if;
  insert into public.event_hits (event_id, user_id, kind) values (p_event, auth.uid(), p_kind)
    on conflict do nothing;
  if not found then return; end if;
  perform set_config('ah.bypass', 'on', true);
  if p_kind = 'view' then
    update public.events set views = views + 1 where id = p_event and status = 'approved';
  elsif p_kind = 'click' then
    update public.events set link_clicks = link_clicks + 1 where id = p_event and status = 'approved';
  end if;
  perform set_config('ah.bypass', 'off', true);
end $$;
revoke execute on function public.track_event(uuid, text) from public, anon;
grant execute on function public.track_event(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- COFRE DE CERTIFICADOS
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 200),
  type_key text,
  hours numeric(6,1) not null default 0 check (hours >= 0 and hours <= 2000),
  issued_on date,
  issuer text,
  status text not null default 'guardado' check (status in ('guardado', 'entregue', 'validado', 'recusado')),
  event_id uuid references public.events(id) on delete set null,
  notes text,
  file_path text,
  file_name text,
  file_mime text,
  missing_requirements text[], -- itens obrigatórios que a leitura não achou no arquivo (null = não conferido)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.certificates add column if not exists missing_requirements text[];
create index if not exists certificates_user on public.certificates (user_id);

create or replace function public.touch_certificate() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.user_id := old.user_id;
  return new;
end $$;
drop trigger if exists certificates_touch on public.certificates;
create trigger certificates_touch before update on public.certificates
  for each row execute function public.touch_certificate();

alter table public.certificates enable row level security;
drop policy if exists "certificado: só o dono" on public.certificates;
create policy "certificado: só o dono" on public.certificates
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- NÚMEROS PARA O PAINEL ADMIN (prova de tração)
-- ---------------------------------------------------------------------------
drop function if exists public.admin_stats();
create or replace function public.admin_stats()
returns table (students bigint, organizers bigint, events bigint, approved_events bigint,
               certificates bigint, hours numeric, going bigint, signups_today bigint, storage_mb numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores';
  end if;
  return query select
    (select count(*) from public.profiles where role = 'student'),
    (select count(*) from public.profiles where role = 'organizer'),
    (select count(*) from public.events),
    (select count(*) from public.events where status = 'approved'),
    (select count(*) from public.certificates),
    (select coalesce(sum(c.hours), 0) from public.certificates c),
    (select count(*) from public.interactions where kind = 'going'),
    (select count(*) from public.profiles
       where (created_at at time zone 'America/Sao_Paulo')::date = (now() at time zone 'America/Sao_Paulo')::date),
    -- espaço usado pelos arquivos (plano grátis do Supabase: 1 GB)
    (select round(coalesce(sum((o.metadata->>'size')::bigint), 0) / 1048576.0, 1)
       from storage.objects o where o.bucket_id in ('certificates', 'event-images'));
end $$;
revoke execute on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- EXCLUIR A PRÓPRIA CONTA (LGPD)
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Sem sessão'; end if;
  delete from auth.users where id = auth.uid(); -- apaga perfil, certificados, eventos e marcações em cascata
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------------------------------------------------------------------------
-- ARQUIVOS (Storage)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('certificates', 'certificates', false, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "cofre: dono lê" on storage.objects;
create policy "cofre: dono lê" on storage.objects for select to authenticated
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "cofre: dono envia" on storage.objects;
create policy "cofre: dono envia" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (select 1 from public.certificates c
                where c.user_id = auth.uid() and storage.filename(name) like c.id::text || '.%')
  );
drop policy if exists "cofre: dono troca" on storage.objects;
create policy "cofre: dono troca" on storage.objects for update to authenticated
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "cofre: dono apaga" on storage.objects;
create policy "cofre: dono apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "capas: organizador envia" on storage.objects;
create policy "capas: organizador envia" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'event-images'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (public.is_admin() or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'organizer' and p.org_status = 'approved'))
  );
drop policy if exists "capas: dono apaga" on storage.objects;
create policy "capas: dono apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'event-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------------------------------------------------------------------------
-- DEPOIS DE CRIAR SUA CONTA NO APP, rode esta linha (com o seu e-mail)
-- para virar administrador:
--   update public.profiles set role = 'admin', onboarded = true where email = 'seu-email@exemplo.com';
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- LIMITES CONTRA ABUSO (texto gigante, links perigosos, encher o armazenamento)
-- ---------------------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_len;
alter table public.profiles add constraint profiles_len check (
  char_length(coalesce(name, '')) <= 120 and char_length(coalesce(org_name, '')) <= 120
  and char_length(coalesce(org_instagram, '')) <= 80 and char_length(coalesce(org_bio, '')) <= 600
  and char_length(coalesce(institution_id, '')) <= 40 and char_length(coalesce(course_id, '')) <= 20
  and char_length(coalesce(institution_name, '')) <= 120);

alter table public.events drop constraint if exists events_len;
alter table public.events add constraint events_len check (
  char_length(coalesce(location, '')) <= 200 and char_length(coalesce(address, '')) <= 200
  and char_length(coalesce(city, '')) <= 80 and char_length(coalesce(organizer_name, '')) <= 120
  and char_length(coalesce(category, '')) <= 30 and coalesce(cardinality(courses), 0) <= 20
  and coalesce(cardinality(requirements), 0) <= 15
  and char_length(coalesce(cert_issuer, '')) <= 150 and char_length(coalesce(cert_signer_name, '')) <= 120
  and char_length(coalesce(cert_signer_role, '')) <= 150 and char_length(coalesce(cert_delivery, '')) <= 300);

-- link de inscrição só http(s): bloqueia "javascript:" (rodaria código no app de quem clicar)
alter table public.events drop constraint if exists events_link_http;
alter table public.events add constraint events_link_http
  check (link is null or link = '' or (link ~* '^https?://[^\s]+$' and char_length(link) <= 500));

-- capa só do próprio app ou do bucket do projeto (evita imagem trocada depois da aprovação e rastreio de IP)
alter table public.events drop constraint if exists events_image_ok;
alter table public.events add constraint events_image_ok check (
  image_url is null or image_url like './events/%'
  or image_url ~ '^https://[a-z0-9-]+\.supabase\.co/storage/v1/object/public/event-images/');

alter table public.certificates drop constraint if exists cert_len;
alter table public.certificates add constraint cert_len check (
  char_length(coalesce(notes, '')) <= 2000 and char_length(coalesce(issuer, '')) <= 200
  and char_length(coalesce(file_name, '')) <= 255 and coalesce(cardinality(missing_requirements), 0) <= 30);

-- no máximo 300 certificados por pessoa
create or replace function public.limit_certificates() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.certificates where user_id = auth.uid()) >= 300 then
    raise exception 'Limite de 300 certificados por pessoa atingido';
  end if;
  return new;
end $$;
drop trigger if exists certificates_limit on public.certificates;
create trigger certificates_limit before insert on public.certificates
  for each row execute function public.limit_certificates();

-- aplica limites de tamanho e tipo também se os buckets já existiam
update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
  where id = 'certificates';
update storage.buckets set file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'], public = true
  where id = 'event-images';

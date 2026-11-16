-- Migração de 16/11/2026: qualquer pessoa sugere eventos (com pré-requisitos) e o evento só é
-- publicado com a aprovação do ADMIN e do COORDENADOR do curso correspondente.
-- Se o curso ainda não tem coordenador no app, a aprovação do admin basta.
-- Rodar no SQL Editor DEPOIS das migrações de 15/11. É seguro rodar mais de uma vez.
--
-- Coordenador correspondente = perfil com role 'coordenador' da mesma instituição do evento e
-- com course_id dentro dos cursos do evento (evento sem curso marcado = qualquer curso;
-- coordenador sem course_id = todos os cursos da instituição).
-- O papel é dado pelo admin (Painel > Equipe) ou pelo SQL Editor; ninguém se promove sozinho.

-- 1) Papel novo ---------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'organizer', 'admin', 'secretaria', 'coordenador'));

-- 2) Registro das duas aprovações ---------------------------------------------
alter table public.events add column if not exists admin_approved_at timestamptz;
alter table public.events add column if not exists admin_approved_by uuid references public.profiles(id) on delete set null;
alter table public.events add column if not exists coord_approved_at timestamptz;
alter table public.events add column if not exists coord_approved_by uuid references public.profiles(id) on delete set null;
-- o que já estava publicado continua publicado
update public.events set admin_approved_at = coalesce(admin_approved_at, created_at) where status = 'approved';

-- 3) Quem coordena o quê -------------------------------------------------------
create or replace function public.event_has_coordinator(p_institution text, p_courses text[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles c
    where c.role = 'coordenador' and c.institution_id is not null and c.institution_id = p_institution
      and (coalesce(cardinality(p_courses), 0) = 0 or c.course_id is null or c.course_id = any (p_courses)))
$$;

create or replace function public.i_coordinate(p_institution text, p_courses text[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles c
    where c.id = auth.uid() and c.role = 'coordenador'
      and c.institution_id is not null and c.institution_id = p_institution
      and (coalesce(cardinality(p_courses), 0) = 0 or c.course_id is null or c.course_id = any (p_courses)))
$$;
revoke execute on function public.event_has_coordinator(text, text[]) from public, anon;
revoke execute on function public.i_coordinate(text, text[]) from public, anon;
grant execute on function public.event_has_coordinator(text, text[]) to authenticated;
grant execute on function public.i_coordinate(text, text[]) to authenticated;

-- 4) Proteção do evento (substitui a anterior) -----------------------------------
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
      -- admin que cria já conta como aprovação do admin; falta o coordenador, se existir
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
    -- quem sugere pode dizer quem organiza (ex.: "Centro Acadêmico de PP"); senão vai o nome do perfil
    new.organizer_name := left(coalesce(nullif(trim(new.organizer_name), ''),
      (select coalesce(org_name, name) from public.profiles where id = auth.uid())), 120);
    return new;
  end if;

  -- UPDATE feito por quem enviou o evento
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
    -- editou o conteúdo: volta para as duas aprovações
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

-- 5) No máximo 5 eventos em análise por pessoa (contra spam) ---------------------
create or replace function public.limit_pending_events() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_admin() then return new; end if;
  if (select count(*) from public.events where organizer_id = auth.uid() and status = 'pending') >= 5 then
    raise exception 'Você já tem 5 eventos em análise. Espere a aprovação antes de enviar outro.';
  end if;
  return new;
end $$;
drop trigger if exists events_limit_pending on public.events;
create trigger events_limit_pending before insert on public.events
  for each row execute function public.limit_pending_events();

-- 6) Aprovar e recusar (admin ou coordenador correspondente) ---------------------
create or replace function public.approve_event(p_event uuid) returns text
language plpgsql security definer set search_path = public as $$
declare
  e public.events;
  admin_ok boolean;
  coord_ok boolean;
begin
  select * into e from public.events where id = p_event;
  if not found then raise exception 'Evento não encontrado'; end if;
  admin_ok := public.is_admin();
  coord_ok := public.i_coordinate(e.institution_id, e.courses);
  if not admin_ok and not coord_ok then raise exception 'Você não pode aprovar este evento'; end if;
  perform set_config('ah.bypass', 'on', true);
  update public.events set
    admin_approved_at = case when admin_ok then now() else admin_approved_at end,
    admin_approved_by = case when admin_ok then auth.uid() else admin_approved_by end,
    coord_approved_at = case when coord_ok then now() else coord_approved_at end,
    coord_approved_by = case when coord_ok then auth.uid() else coord_approved_by end,
    reject_reason = null
  where id = p_event returning * into e;
  update public.events set status = case
      when e.admin_approved_at is not null
       and (e.coord_approved_at is not null or not public.event_has_coordinator(e.institution_id, e.courses))
      then 'approved' else 'pending' end
  where id = p_event returning * into e;
  perform set_config('ah.bypass', 'off', true);
  return e.status;
end $$;

create or replace function public.reject_event(p_event uuid, p_reason text) returns text
language plpgsql security definer set search_path = public as $$
declare e public.events;
begin
  select * into e from public.events where id = p_event;
  if not found then raise exception 'Evento não encontrado'; end if;
  if not public.is_admin() and not public.i_coordinate(e.institution_id, e.courses) then
    raise exception 'Você não pode recusar este evento';
  end if;
  perform set_config('ah.bypass', 'on', true);
  update public.events set status = 'rejected', reject_reason = left(coalesce(nullif(trim(p_reason), ''), 'Sem motivo informado'), 500),
    admin_approved_at = null, admin_approved_by = null, coord_approved_at = null, coord_approved_by = null
  where id = p_event;
  perform set_config('ah.bypass', 'off', true);
  return 'rejected';
end $$;
revoke execute on function public.approve_event(uuid) from public, anon;
revoke execute on function public.reject_event(uuid, text) from public, anon;
grant execute on function public.approve_event(uuid) to authenticated;
grant execute on function public.reject_event(uuid, text) to authenticated;

-- 7) Permissões ----------------------------------------------------------------
-- qualquer pessoa com cadastro completo envia evento (entra em análise)
drop policy if exists "evento: organizador aprovado cria" on public.events;
drop policy if exists "evento: qualquer pessoa envia" on public.events;
create policy "evento: qualquer pessoa envia" on public.events
  for insert to authenticated
  with check (
    (organizer_id = auth.uid() or public.is_admin())
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.onboarded)
  );

-- coordenador vê (para aprovar) os eventos dos cursos que coordena
drop policy if exists "evento: coordenador vê os do seu curso" on public.events;
create policy "evento: coordenador vê os do seu curso" on public.events
  for select to authenticated using (public.i_coordinate(institution_id, courses));

-- capa do evento: qualquer pessoa com cadastro, na própria pasta
drop policy if exists "capas: organizador envia" on storage.objects;
drop policy if exists "capas: quem envia evento" on storage.objects;
create policy "capas: quem envia evento" on storage.objects for insert to authenticated
  with check (bucket_id = 'event-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- 8) Perfil: ninguém vira coordenador sozinho; coordenador não troca de curso sozinho ---------
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
  -- ninguém se promove a secretaria ou coordenador, e quem tem esses papéis não troca de papel nem de instituição sozinho
  if new.role in ('secretaria', 'coordenador') and old.role is distinct from new.role then
    new.role := old.role;
  end if;
  if old.role in ('secretaria', 'coordenador') then
    new.role := old.role;
    new.institution_id := old.institution_id;
  end if;
  if old.role = 'coordenador' then
    new.course_id := old.course_id;
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
  -- consentimento para a secretaria: o servidor grava a hora; revogar (null) é sempre permitido;
  -- trocar de instituição revoga, para não expor o aluno à secretaria de outra faculdade
  if new.secretaria_consent_at is null then
    null;
  elsif new.institution_id is distinct from old.institution_id then
    new.secretaria_consent_at := null;
  elsif old.secretaria_consent_at is null then
    new.secretaria_consent_at := now();
  else
    new.secretaria_consent_at := old.secretaria_consent_at;
  end if;
  return new;
end $$;

notify pgrst, 'reload schema';

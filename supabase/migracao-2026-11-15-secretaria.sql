-- Migração de 15/11/2026: aba Secretaria (piloto IELUSC).
-- Rodar no SQL Editor do Supabase DEPOIS de migracao-2026-11-15-ano-ingresso.sql. É seguro rodar mais de uma vez.
--
-- Regras de privacidade (LGPD), garantidas pelo banco e não pela tela:
--   * a secretaria só enxerga alunos da MESMA instituição que AUTORIZARAM o compartilhamento
--     (profiles.secretaria_consent_at preenchido pelo próprio aluno; ele pode revogar quando quiser);
--   * só vê certificados que o aluno marcou como enviados (status diferente de 'guardado'), e o arquivo deles;
--   * na avaliação, a secretaria só muda o status (validado / recusado / entregue) e a observação;
--     o resto do certificado continua sendo do aluno;
--   * ninguém vira secretaria sozinho: o papel é dado pelo SQL Editor ou por um admin.
--
-- Para criar a conta da secretaria (depois de a pessoa se cadastrar no app com o e-mail institucional):
--   update public.profiles set role = 'secretaria', institution_id = 'ielusc', onboarded = true
--   where email = 'email-da-secretaria@ielusc.br';

-- 1) Campos novos -------------------------------------------------------------
alter table public.profiles add column if not exists student_number text;   -- matrícula (opcional)
alter table public.profiles add column if not exists class_group text;      -- turma (opcional)
alter table public.profiles add column if not exists secretaria_consent_at timestamptz;

alter table public.profiles drop constraint if exists profiles_sec_len;
alter table public.profiles add constraint profiles_sec_len check (
  char_length(coalesce(student_number, '')) <= 30 and char_length(coalesce(class_group, '')) <= 40);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'organizer', 'admin', 'secretaria'));

alter table public.certificates add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;
alter table public.certificates add column if not exists reviewed_at timestamptz;
alter table public.certificates add column if not exists review_note text;
alter table public.certificates drop constraint if exists certificates_review_len;
alter table public.certificates add constraint certificates_review_len check (char_length(coalesce(review_note, '')) <= 500);

-- 2) Quem a secretaria pode ver ----------------------------------------------
create or replace function public.my_secretaria_institution() returns text
language sql stable security definer set search_path = public as $$
  select institution_id from public.profiles where id = auth.uid() and role = 'secretaria'
$$;

create or replace function public.secretaria_sees(p_student uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles s
    where s.id = p_student and s.role = 'student'
      and s.secretaria_consent_at is not null
      and s.institution_id is not null
      and s.institution_id = public.my_secretaria_institution())
$$;
revoke execute on function public.my_secretaria_institution() from public, anon;
revoke execute on function public.secretaria_sees(uuid) from public, anon;
grant execute on function public.my_secretaria_institution() to authenticated;
grant execute on function public.secretaria_sees(uuid) to authenticated;

-- 3) Proteção do perfil (mesma função de antes + regras da secretaria) --------
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
  -- ninguém se promove a secretaria, e a secretaria não troca de papel nem de instituição sozinha
  if new.role = 'secretaria' and old.role <> 'secretaria' then
    new.role := old.role;
  end if;
  if old.role = 'secretaria' then
    new.role := old.role;
    new.institution_id := old.institution_id;
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

-- 4) Certificados: o que a secretaria pode mudar ------------------------------
create or replace function public.touch_certificate() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.user_id := old.user_id;
  if auth.uid() is not null and auth.uid() <> old.user_id and not public.is_admin() then
    -- secretaria avaliando: só status e observação; o resto fica como o aluno deixou
    if new.status not in ('entregue', 'validado', 'recusado') then
      raise exception 'Status inválido para a secretaria';
    end if;
    new.title := old.title; new.type_key := old.type_key; new.hours := old.hours;
    new.issued_on := old.issued_on; new.issuer := old.issuer; new.event_id := old.event_id;
    new.notes := old.notes; new.file_path := old.file_path; new.file_name := old.file_name;
    new.file_mime := old.file_mime; new.missing_requirements := old.missing_requirements;
    new.created_at := old.created_at;
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
    return new;
  end if;
  -- o aluno não forja a avaliação da secretaria
  new.reviewed_by := old.reviewed_by;
  new.reviewed_at := old.reviewed_at;
  new.review_note := old.review_note;
  -- se o aluno mudar o conteúdo de um certificado já avaliado pela secretaria, ele volta para análise
  if old.reviewed_by is not null and (
      new.title is distinct from old.title or new.hours is distinct from old.hours
      or new.type_key is distinct from old.type_key or new.issued_on is distinct from old.issued_on
      or new.file_path is distinct from old.file_path) then
    new.status := 'entregue';
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.review_note := null;
  end if;
  return new;
end $$;

-- 5) Permissões (somam às que já existem) ------------------------------------
drop policy if exists "perfil: secretaria vê quem autorizou" on public.profiles;
create policy "perfil: secretaria vê quem autorizou" on public.profiles
  for select to authenticated using (public.secretaria_sees(id));

drop policy if exists "certificado: secretaria lê enviados" on public.certificates;
create policy "certificado: secretaria lê enviados" on public.certificates
  for select to authenticated using (status <> 'guardado' and public.secretaria_sees(user_id));

drop policy if exists "certificado: secretaria avalia" on public.certificates;
create policy "certificado: secretaria avalia" on public.certificates
  for update to authenticated
  using (status <> 'guardado' and public.secretaria_sees(user_id))
  with check (public.secretaria_sees(user_id));

drop policy if exists "cofre: secretaria lê enviados" on storage.objects;
create policy "cofre: secretaria lê enviados" on storage.objects for select to authenticated
  using (
    bucket_id = 'certificates'
    and exists (select 1 from public.certificates c
                where c.file_path = name and c.status <> 'guardado'
                  and public.secretaria_sees(c.user_id))
  );

-- Migração: data de nascimento como 1ª senha (troca obrigatória) e tipo/nome da instituição.
-- Rode no SQL Editor de um banco que já tinha o schema.sql anterior.
alter table public.profiles add column if not exists institution_type text
  check (institution_type in ('faculdade', 'universidade', 'centro_universitario'));
alter table public.profiles add column if not exists institution_name text;
alter table public.profiles add column if not exists password_set boolean not null default false;

alter table public.profiles drop constraint if exists profiles_len;
alter table public.profiles add constraint profiles_len check (
  char_length(coalesce(name, '')) <= 120 and char_length(coalesce(org_name, '')) <= 120
  and char_length(coalesce(org_instagram, '')) <= 80 and char_length(coalesce(org_bio, '')) <= 600
  and char_length(coalesce(institution_id, '')) <= 40 and char_length(coalesce(course_id, '')) <= 20
  and char_length(coalesce(institution_name, '')) <= 120);

notify pgrst, 'reload schema';

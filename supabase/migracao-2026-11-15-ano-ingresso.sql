-- Migração de 15/11/2026: ano de ingresso do aluno (a matriz de ingresso define quantas horas complementares valem).
-- Rodar no SQL Editor do Supabase ANTES de publicar a versão do app com o catálogo de regulamentos.
-- É seguro rodar mais de uma vez. O app continua funcionando sem esta coluna (salva o resto do perfil),
-- mas o ano de ingresso só é guardado depois que ela existir.
alter table public.profiles add column if not exists entry_year smallint
  check (entry_year between 2000 and 2100);

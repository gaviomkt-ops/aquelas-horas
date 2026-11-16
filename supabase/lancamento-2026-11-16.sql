-- ============================================================================
-- Àquelas Horas · lançamento de 16/11/2026 (rodar UMA vez no SQL Editor, inteiro)
-- 1) ano de ingresso  2) aba Secretaria  3) sua conta vira admin  4) os 6 eventos
-- Seguro rodar de novo: nada é duplicado.
-- ============================================================================

-- ---------- 1) migracao-2026-11-15-ano-ingresso.sql ----------
-- Migração de 15/11/2026: ano de ingresso do aluno (a matriz de ingresso define quantas horas complementares valem).
-- Rodar no SQL Editor do Supabase ANTES de publicar a versão do app com o catálogo de regulamentos.
-- É seguro rodar mais de uma vez. O app continua funcionando sem esta coluna (salva o resto do perfil),
-- mas o ano de ingresso só é guardado depois que ela existir.
alter table public.profiles add column if not exists entry_year smallint
  check (entry_year between 2000 and 2100);

-- ---------- 2) migracao-2026-11-15-secretaria.sql ----------
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

-- ---------- 3) admin: só promove se existir UMA única conta (a sua) ----------
-- Se houver mais de uma conta, nada é promovido e o resultado no fim mostra "admin" vazio.
update public.profiles set role = 'admin', onboarded = true
where (select count(*) from public.profiles) = 1
  and not exists (select 1 from public.profiles where role = 'admin');

-- ---------- 4) eventos-iniciais.sql ----------
-- ============================================================================
-- Eventos iniciais da vitrine (gerado por scripts/gerar-sql-eventos.mjs; não edite à mão)
-- Rode DEPOIS do schema.sql e DEPOIS de promover sua conta a admin.
-- Os eventos ficam no nome do primeiro admin e já entram publicados.
-- Pode rodar de novo: evento com mesmo título e horário não é duplicado.
-- ============================================================================

-- APP Brasil - Oficina de personalizados na AEP
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$APP Brasil$t$, $t$APP Brasil - Oficina de personalizados na AEP$t$, $t$curso$t$, 4, $t$2026-11-17T22:30:00.000Z$t$, null,
  $t$AEP$t$, $t$$t$, $t$Joinville$t$, 0, $t$$t$, 10, array[$t$Enviar os arquivos que pretende personalizar até 24 horas antes da oficina.$t$, $t$Levar seus próprios itens para sublimar (ex.: camiseta, toalha, bolsa, ecobag, calça).$t$]::text[],
  $t$Oficina prática de personalizados com sublimação, promovida pela APP Brasil na AEP. Vale 4 horas complementares. Apenas 10 vagas.$t$, '{}'::text[], $t$./events/app-brasil.jpg$t$, $t$ielusc$t$, 'approved', $t$none$t$, null,
  $t$APP Brasil$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$concluiu$t$, null
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$APP Brasil - Oficina de personalizados na AEP$t$ and x.starts_at = $t$2026-11-17T22:30:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

-- Bancas de TCC de PP · segunda, 16/11
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$Publicidade e Propaganda · IELUSC$t$, $t$Bancas de TCC de PP · segunda, 16/11$t$, $t$cientifico$t$, 2, $t$2026-11-16T22:00:00.000Z$t$, $t$2026-11-17T01:00:00.000Z$t$,
  $t$IELUSC Campus Centro · Anfiteatro e sala C30$t$, $t$$t$, $t$Joinville$t$, 0, $t$$t$, null, array[$t$Acompanhar as três bancas de uma mesma noite.$t$, $t$Assinar a lista de presença.$t$]::text[],
  $t$Bancas dos Trabalhos de Conclusão de Curso (TCC) 2026 de Publicidade e Propaganda. Professores e estudantes estão convidados a prestigiar as apresentações.

A participação vale 2 horas de atividade complementar por noite, mediante registro na lista de presença. Quem acompanha as três noites (16, 17 e 18/11) pode acumular 6 horas. Nessas noites, as aulas de PP são direcionadas ao acompanhamento das bancas.

Programação da noite:
19h · Anfiteatro · Marisabel Mendes e Ellen da Silva · Magnólia (Projeto Inovador)
19h · C30 · Rafaela Rodrigues da Costa · Influenciadoras digitais no Instagram e a normatização de padrões: representações do corpo em vídeo fitness e percepção de mulheres adultas (Monografia)
20h · Anfiteatro · Ana Neumann e Isabella Marques · Toró Criativo: marketing estratégico para não chover no molhado (Projeto Inovador)
20h · C30 · Mariana Silveira · A experiência da música eletrônica para além do entretenimento: bem-estar, pertencimento e transcendência (Monografia)
21h · C30 · Caroline Rochadel Wendt · Fast fashion e alta-costura: a construção da percepção de valor por meio das coleções colaborativas (Monografia)$t$, array[$t$PP$t$]::text[], $t$./events/bancas-pp.jpg$t$, $t$ielusc$t$, 'approved', $t$none$t$, null,
  $t$Faculdade IELUSC$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$participou$t$, $t$Mediante registro na lista de presença de cada noite.$t$
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$Bancas de TCC de PP · segunda, 16/11$t$ and x.starts_at = $t$2026-11-16T22:00:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

-- Bancas de TCC de PP · terça, 17/11
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$Publicidade e Propaganda · IELUSC$t$, $t$Bancas de TCC de PP · terça, 17/11$t$, $t$cientifico$t$, 2, $t$2026-11-17T21:00:00.000Z$t$, $t$2026-11-18T01:00:00.000Z$t$,
  $t$IELUSC Campus Centro · Anfiteatro e sala C30$t$, $t$$t$, $t$Joinville$t$, 0, $t$$t$, null, array[$t$Acompanhar as três bancas de uma mesma noite.$t$, $t$Assinar a lista de presença.$t$]::text[],
  $t$Bancas dos Trabalhos de Conclusão de Curso (TCC) 2026 de Publicidade e Propaganda. Professores e estudantes estão convidados a prestigiar as apresentações.

A participação vale 2 horas de atividade complementar por noite, mediante registro na lista de presença. Quem acompanha as três noites (16, 17 e 18/11) pode acumular 6 horas. Nessas noites, as aulas de PP são direcionadas ao acompanhamento das bancas.

Programação da noite:
18h · Anfiteatro · Bárbara Vitória Santos e Gabriela Beatriz Muniz · Plan&Go: plano de marketing e comunicação para o lançamento da funcionalidade pet travel (Projeto Inovador)
18h · C30 · Rita Vitorino · Algoritmo na publicidade digital: as 3 camadas da publicidade algorítmica (Monografia)
19h · Anfiteatro · Rafaela Soares e Luiz Anacleto · Reconstruindo identidades: a beleza como ferramenta de autoestima e valorização feminina para mulheres em situação de vulnerabilidade social (Projeto Inovador)
19h · C30 · Geovana Fernandes Koehler e Laura Martins · Íris: plataforma de inteligência de tendências (Projeto Inovador)
20h · Anfiteatro · Daniele dos Santos e Maria Fernanda Tavares · "Fora de QuÊ?" (Projeto Inovador)
20h · C30 · Camille Löffler · Publicidade muda o mundo? A campanha "The Greatest" da Apple e a percepção de pessoas com deficiência sobre a comunicação com propósito (Monografia)
21h · Anfiteatro · Maria Fernanda Alexandre Ramos e Julia Cristina dos Santos · Meu Pet ID: gestão da vida pet (Projeto Inovador)
21h · C30 · Andressa Diovana Dalcastagnê · Entre produção e consumo: valor percebido do artesanato e sua comunicação nas feiras da economia criativa em Joinville (SC) (Monografia)$t$, array[$t$PP$t$]::text[], $t$./events/bancas-pp.jpg$t$, $t$ielusc$t$, 'approved', $t$none$t$, null,
  $t$Faculdade IELUSC$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$participou$t$, $t$Mediante registro na lista de presença de cada noite.$t$
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$Bancas de TCC de PP · terça, 17/11$t$ and x.starts_at = $t$2026-11-17T21:00:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

-- Bancas de TCC de PP · quarta, 18/11
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$Publicidade e Propaganda · IELUSC$t$, $t$Bancas de TCC de PP · quarta, 18/11$t$, $t$cientifico$t$, 2, $t$2026-11-18T21:00:00.000Z$t$, $t$2026-11-19T01:00:00.000Z$t$,
  $t$IELUSC Campus Centro · Anfiteatro e sala C30$t$, $t$$t$, $t$Joinville$t$, 0, $t$$t$, null, array[$t$Acompanhar as três bancas de uma mesma noite.$t$, $t$Assinar a lista de presença.$t$]::text[],
  $t$Bancas dos Trabalhos de Conclusão de Curso (TCC) 2026 de Publicidade e Propaganda. Professores e estudantes estão convidados a prestigiar as apresentações.

A participação vale 2 horas de atividade complementar por noite, mediante registro na lista de presença. Quem acompanha as três noites (16, 17 e 18/11) pode acumular 6 horas. Nessas noites, as aulas de PP são direcionadas ao acompanhamento das bancas.

Programação da noite:
18h · Anfiteatro · Julia Lorena e Ketlyn Santos · Ajeitei: aplicativo de mala de viagem (Projeto Inovador)
18h · C30 · Danielli Camargo da Luz · A construção da identidade nas redes sociais: um estudo sobre autorrelatos de Roberta Vicente no YouTube (Monografia)
19h · Anfiteatro · Manuella Duarte e Alice Gesser Lima · Ponte+: da margem ao centro, um projeto de conexão entre artistas urbanos e o mercado catarinense (Projeto Inovador)
20h · Anfiteatro · Talita Bérgamo, Manuele Popovici e Harielle Weiers · Já sabe o que fazer no seu Find? (Findi) (Projeto Inovador)
21h · Anfiteatro · Mariane Boldt e Isabella Maria Massaneiro · Plataforma digital de troca de experiências, habilidades e serviços (Trokar) (Projeto Inovador)
21h · C30 · Eduarda Anacleto Rodrigues e Valenthyne Eugenia Chagas da Silva · Garimpei! Plataforma online de moda circular para brechós (Projeto Inovador)$t$, array[$t$PP$t$]::text[], $t$./events/bancas-pp.jpg$t$, $t$ielusc$t$, 'approved', $t$none$t$, null,
  $t$Faculdade IELUSC$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$participou$t$, $t$Mediante registro na lista de presença de cada noite.$t$
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$Bancas de TCC de PP · quarta, 18/11$t$ and x.starts_at = $t$2026-11-18T21:00:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

-- Concurso de TCC 2026 · Prêmio Prof. Ricardo Ramos
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$APP Brasil$t$, $t$Concurso de TCC 2026 · Prêmio Prof. Ricardo Ramos$t$, $t$concurso$t$, 5, $t$2026-11-15T03:00:00.000Z$t$, $t$2026-12-08T02:59:00.000Z$t$,
  $t$Inscrição online · final na sede da Globo, em São Paulo$t$, $t$$t$, $t$São Paulo$t$, 0, $t$https://www.appbrasil.org.br/concursotcc2026/$t$, null, array[$t$Ter um TCC de Publicidade e Propaganda (ou área correlata) desenvolvido no último ano do curso.$t$, $t$Fazer a inscrição pelo formulário do site da APP Brasil até a meia-noite de 07/12/2026.$t$, $t$Enviar um vídeo case de até 6 minutos sobre o TCC.$t$, $t$Na categoria Monografia/Artigo Científico, enviar também o arquivo completo do trabalho.$t$]::text[],
  $t$A APP Brasil abriu as inscrições para a 45ª edição do Concurso de TCC – Prêmio Prof. Ricardo Ramos, que reconhece os melhores trabalhos acadêmicos de comunicação e aproxima novos talentos de profissionais do mercado. A participação é gratuita e recebe inscrições de instituições de todo o Brasil.

Categorias:
• Campanha Publicitária: vídeo case com produto/marca, público, pesquisa de mercado, objetivos e estratégias, peças e investimento.
• Monografia / Artigo Científico: vídeo case resumindo a pesquisa e o arquivo completo do trabalho.
• Comunicação Estratégica: projetos de consultoria ou novo negócio em comunicação, com análise dos resultados.
• Prêmio Master Globo: plano de mídia multiplataforma, defendendo os canais e estratégias escolhidos.

Datas: inscrições até 07/12/2026; finalistas (até 3 por categoria) divulgados até 13/12 no site da APP; final em 17/12/2026, com apresentação de até 15 minutos para uma banca de profissionais na sede da Globo, em São Paulo. Finalistas de fora de São Paulo podem apresentar de forma remota.

Os 3 primeiros de cada categoria recebem troféu, certificado e um ano como associados da APP. Todos os inscritos recebem certificado de participação.

Horas complementares: pela tabela da IELUSC, participação em concursos vale 5h por trabalho, a critério da coordenação.

Realização: APP Brasil. Apoio: Globo e DPZ. Dúvidas: secretaria@appbrasil.org.br.$t$, array[$t$PP$t$]::text[], $t$./events/concurso-tcc-app.jpg$t$, $t$ielusc$t$, 'approved', $t$none$t$, null,
  $t$APP Brasil$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$participou$t$, $t$Todos os inscritos recebem certificado de participação (regulamento, item 6.5).$t$
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$Concurso de TCC 2026 · Prêmio Prof. Ricardo Ramos$t$ and x.starts_at = $t$2026-11-15T03:00:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

-- Picture 10 anos · edição especial
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, $t$Picture · 2ª fase de PP IELUSC$t$, $t$Picture 10 anos · edição especial$t$, $t$palestra$t$, 4, $t$2026-11-19T22:00:00.000Z$t$, null,
  $t$IELUSC Campus Centro · Auditório (Anfiteatro)$t$, $t$$t$, $t$Joinville$t$, 0, $t$$t$, null, '{}'::text[],
  $t$Toda fotografia conta uma história. E o Picture já soma 10 anos de histórias para contar.

Para celebrar essa trajetória, os estudantes da 2ª fase de Publicidade e Propaganda preparam uma edição especial do Picture, com convidados como Rodrigo Philipps (fotógrafo e filmmaker, com mais de 15 anos de experiência no mercado audiovisual) e Ana Dadam (designer especialista em gestão e criação de moda).

Vale 4 horas complementares. A entrada é gratuita e aberta ao público: não precisa ser aluno do IELUSC para participar. Na quinta-feira, as aulas de PP são direcionadas ao Picture.

A próxima cena começa com você.$t$, '{}'::text[], $t$./events/picture-capa.jpg$t$, $t$ielusc$t$, 'approved', $t$active$t$, $t$2026-11-20T02:59:00.000Z$t$,
  $t$Faculdade IELUSC$t$, $t$Prof. Me. Vinicios Neves$t$, $t$Coordenador do Curso de Publicidade e Propaganda$t$, $t$participou$t$, null
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = $t$Picture 10 anos · edição especial$t$ and x.starts_at = $t$2026-11-19T22:00:00.000Z$t$::timestamptz)
order by p.created_at
limit 1;

notify pgrst, 'reload schema';

-- ---------- conferência: este é o resultado que aparece embaixo ----------
select
  (select string_agg(email, ', ') from public.profiles where role = 'admin') as admin,
  (select count(*) from public.profiles) as contas,
  (select count(*) from public.events where status = 'approved') as eventos_publicados;

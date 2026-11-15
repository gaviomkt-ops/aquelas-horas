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

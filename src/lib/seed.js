// Dados do MODO DEMONSTRAÇÃO: contas de teste e os eventos reais da vitrine.
// No modo online (Supabase) os eventos entram por supabase/eventos-iniciais.sql.

// Sobe quando a lista de eventos reais muda: bancos demo antigos são atualizados.
export const SEED_VERSION = 16;

// IELUSC Campus Centro (Rua Princesa Isabel, 438), pelo OpenStreetMap: usado no check-in por GPS
export const IELUSC_CENTRO = { geo_lat: -26.2993229, geo_lng: -48.8468081, geo_radius_m: 200 };

// Eventos reais (divulgados pelo curso de PP da IELUSC e parceiros). São os mesmos que
// supabase/eventos-iniciais.sql publica no modo online (gerado por scripts/gerar-sql-eventos.mjs).
// Os certificados de horas do curso são sempre assinados pelo coordenador de PP.
export const COORDINATOR = { name: 'Prof. Me. Vinicios Neves', role: 'Coordenador do Curso de Publicidade e Propaganda' };

const BASE = {
  cert_signer_name: COORDINATOR.name,
  cert_signer_role: COORDINATOR.role,
  status: 'approved',
  city: 'Joinville',
  address: '',
  link: '',
  image_url: null,
  courses: [],
  institution_id: 'ielusc',
  boost_status: 'none',
  boost_until: null,
  views: 0,
  link_clicks: 0,
  is_example: false,
  created_at: '2026-11-15T12:00:00.000Z',
  updated_at: '2026-11-15T12:00:00.000Z',
};

const BANCA_REQS = [
  'Acompanhar as três bancas de uma mesma noite.',
  'Assinar a lista de presença.',
];
const BANCA_NOTE =
  'A participação vale 2 horas de atividade complementar por noite, mediante registro na lista de presença. Quem acompanha as três noites (16, 17 e 18/11) pode acumular 6 horas. Nessas noites, as aulas de PP são direcionadas ao acompanhamento das bancas.';

function banca(id, dia, data, inicio, programacao) {
  return {
    ...BASE,
    id,
    organizer_name: 'Publicidade e Propaganda · IELUSC',
    title: `Bancas de TCC de PP · ${dia}`,
    category: 'cientifico',
    hours: 2,
    starts_at: `${data}T${inicio}:00-03:00`,
    ends_at: `${data}T22:00:00-03:00`, // a última banca da noite começa às 21h
    location: 'IELUSC Campus Centro · Anfiteatro e sala C30',
    image_url: './events/bancas-pp.jpg',
    price: 0,
    capacity: null,
    courses: ['PP'],
    requirements: BANCA_REQS,
    cert_issuer: 'Faculdade IELUSC',
    cert_participation: 'participou',
    cert_delivery: 'Mediante registro na lista de presença de cada noite.',
    description: `Bancas dos Trabalhos de Conclusão de Curso (TCC) 2026 de Publicidade e Propaganda. Professores e estudantes estão convidados a prestigiar as apresentações.\n\n${BANCA_NOTE}\n\nProgramação da noite:\n${programacao}`,
  };
}

const toIso = (v) => (v ? new Date(v).toISOString() : null);

export const REAL_EVENTS = [
  {
    ...BASE,
    id: 'app-brasil-oficina-personalizados',
    organizer_name: 'APP Brasil',
    title: 'APP Brasil - Oficina de personalizados na AEP',
    category: 'curso',
    hours: 4,
    starts_at: '2026-11-17T19:30:00-03:00',
    ends_at: null, // horário de término não informado
    location: 'AEP',
    image_url: './events/app-brasil.jpg',
    price: 0,
    capacity: 10,
    cert_issuer: 'APP Brasil',
    cert_participation: 'concluiu',
    requirements: [
      'Enviar os arquivos que pretende personalizar até 24 horas antes da oficina.',
      'Levar seus próprios itens para sublimar (ex.: camiseta, toalha, bolsa, ecobag, calça).',
    ],
    description: 'Oficina prática de personalizados com sublimação, promovida pela APP Brasil na AEP. Vale 4 horas complementares. Apenas 10 vagas.',
  },
  banca(
    'bancas-pp-16-11',
    'segunda, 16/11',
    '2026-11-16',
    '19:00',
    [
      '19h · Anfiteatro · Marisabel Mendes e Ellen da Silva · Magnólia (Projeto Inovador)',
      '19h · C30 · Rafaela Rodrigues da Costa · Influenciadoras digitais no Instagram e a normatização de padrões: representações do corpo em vídeo fitness e percepção de mulheres adultas (Monografia)',
      '20h · Anfiteatro · Ana Neumann e Isabella Marques · Toró Criativo: marketing estratégico para não chover no molhado (Projeto Inovador)',
      '20h · C30 · Mariana Silveira · A experiência da música eletrônica para além do entretenimento: bem-estar, pertencimento e transcendência (Monografia)',
      '21h · C30 · Caroline Rochadel Wendt · Fast fashion e alta-costura: a construção da percepção de valor por meio das coleções colaborativas (Monografia)',
    ].join('\n'),
  ),
  banca(
    'bancas-pp-17-11',
    'terça, 17/11',
    '2026-11-17',
    '18:00',
    [
      '18h · Anfiteatro · Bárbara Vitória Santos e Gabriela Beatriz Muniz · Plan&Go: plano de marketing e comunicação para o lançamento da funcionalidade pet travel (Projeto Inovador)',
      '18h · C30 · Rita Vitorino · Algoritmo na publicidade digital: as 3 camadas da publicidade algorítmica (Monografia)',
      '19h · Anfiteatro · Rafaela Soares e Luiz Anacleto · Reconstruindo identidades: a beleza como ferramenta de autoestima e valorização feminina para mulheres em situação de vulnerabilidade social (Projeto Inovador)',
      '19h · C30 · Geovana Fernandes Koehler e Laura Martins · Íris: plataforma de inteligência de tendências (Projeto Inovador)',
      '20h · Anfiteatro · Daniele dos Santos e Maria Fernanda Tavares · "Fora de QuÊ?" (Projeto Inovador)',
      '20h · C30 · Camille Löffler · Publicidade muda o mundo? A campanha "The Greatest" da Apple e a percepção de pessoas com deficiência sobre a comunicação com propósito (Monografia)',
      '21h · Anfiteatro · Maria Fernanda Alexandre Ramos e Julia Cristina dos Santos · Meu Pet ID: gestão da vida pet (Projeto Inovador)',
      '21h · C30 · Andressa Diovana Dalcastagnê · Entre produção e consumo: valor percebido do artesanato e sua comunicação nas feiras da economia criativa em Joinville (SC) (Monografia)',
    ].join('\n'),
  ),
  banca(
    'bancas-pp-18-11',
    'quarta, 18/11',
    '2026-11-18',
    '18:00',
    [
      '18h · Anfiteatro · Julia Lorena e Ketlyn Santos · Ajeitei: aplicativo de mala de viagem (Projeto Inovador)',
      '18h · C30 · Danielli Camargo da Luz · A construção da identidade nas redes sociais: um estudo sobre autorrelatos de Roberta Vicente no YouTube (Monografia)',
      '19h · Anfiteatro · Manuella Duarte e Alice Gesser Lima · Ponte+: da margem ao centro, um projeto de conexão entre artistas urbanos e o mercado catarinense (Projeto Inovador)',
      '20h · Anfiteatro · Talita Bérgamo, Manuele Popovici e Harielle Weiers · Já sabe o que fazer no seu Find? (Findi) (Projeto Inovador)',
      '21h · Anfiteatro · Mariane Boldt e Isabella Maria Massaneiro · Plataforma digital de troca de experiências, habilidades e serviços (Trokar) (Projeto Inovador)',
      '21h · C30 · Eduarda Anacleto Rodrigues e Valenthyne Eugenia Chagas da Silva · Garimpei! Plataforma online de moda circular para brechós (Projeto Inovador)',
    ].join('\n'),
  ),
  {
    ...BASE,
    id: 'concurso-tcc-app-2026',
    organizer_name: 'APP Brasil',
    title: 'Concurso de TCC 2026 · Prêmio Prof. Ricardo Ramos',
    category: 'concurso',
    hours: 5, // tabela IELUSC: participação em concursos vale 5h por trabalho, a critério da coordenação
    starts_at: '2026-11-15T00:00:00-03:00', // inscrições abertas
    ends_at: '2026-12-07T23:59:00-03:00', // inscrições até a meia-noite de 07/12
    location: 'Inscrição online · final na sede da Globo, em São Paulo',
    city: 'São Paulo',
    link: 'https://www.appbrasil.org.br/concursotcc2026/',
    cert_issuer: 'APP Brasil',
    cert_participation: 'participou',
    cert_delivery: 'Todos os inscritos recebem certificado de participação (regulamento, item 6.5).',
    image_url: './events/concurso-tcc-app.jpg',
    price: 0,
    capacity: null,
    courses: ['PP'],
    requirements: [
      'Ter um TCC de Publicidade e Propaganda (ou área correlata) desenvolvido no último ano do curso.',
      'Fazer a inscrição pelo formulário do site da APP Brasil até a meia-noite de 07/12/2026.',
      'Enviar um vídeo case de até 6 minutos sobre o TCC.',
      'Na categoria Monografia/Artigo Científico, enviar também o arquivo completo do trabalho.',
    ],
    description:
      'A APP Brasil abriu as inscrições para a 45ª edição do Concurso de TCC – Prêmio Prof. Ricardo Ramos, que reconhece os melhores trabalhos acadêmicos de comunicação e aproxima novos talentos de profissionais do mercado. A participação é gratuita e recebe inscrições de instituições de todo o Brasil.\n\nCategorias:\n• Campanha Publicitária: vídeo case com produto/marca, público, pesquisa de mercado, objetivos e estratégias, peças e investimento.\n• Monografia / Artigo Científico: vídeo case resumindo a pesquisa e o arquivo completo do trabalho.\n• Comunicação Estratégica: projetos de consultoria ou novo negócio em comunicação, com análise dos resultados.\n• Prêmio Master Globo: plano de mídia multiplataforma, defendendo os canais e estratégias escolhidos.\n\nDatas: inscrições até 07/12/2026; finalistas (até 3 por categoria) divulgados até 13/12 no site da APP; final em 17/12/2026, com apresentação de até 15 minutos para uma banca de profissionais na sede da Globo, em São Paulo. Finalistas de fora de São Paulo podem apresentar de forma remota.\n\nOs 3 primeiros de cada categoria recebem troféu, certificado e um ano como associados da APP. Todos os inscritos recebem certificado de participação.\n\nHoras complementares: pela tabela da IELUSC, participação em concursos vale 5h por trabalho, a critério da coordenação.\n\nRealização: APP Brasil. Apoio: Globo e DPZ. Dúvidas: secretaria@appbrasil.org.br.',
  },
  {
    ...BASE,
    id: 'picture-10-anos',
    organizer_name: 'Picture · 2ª fase de PP IELUSC',
    title: 'Picture 10 anos · edição especial',
    category: 'palestra',
    hours: 4,
    starts_at: '2026-11-19T19:00:00-03:00',
    ends_at: null,
    location: 'IELUSC Campus Centro · Auditório (Anfiteatro)',
    price: 0,
    capacity: null,
    image_url: './events/picture-capa.jpg',
    cert_issuer: 'Faculdade IELUSC',
    cert_participation: 'participou',
    boost_status: 'active',
    boost_until: '2026-11-19T23:59:00-03:00',
    requirements: [],
    description:
      'Toda fotografia conta uma história. E o Picture já soma 10 anos de histórias para contar.\n\nPara celebrar essa trajetória, os estudantes da 2ª fase de Publicidade e Propaganda preparam uma edição especial do Picture, com convidados como Rodrigo Philipps (fotógrafo e filmmaker, com mais de 15 anos de experiência no mercado audiovisual) e Ana Dadam (designer especialista em gestão e criação de moda).\n\nVale 4 horas complementares. A entrada é gratuita e aberta ao público: não precisa ser aluno do IELUSC para participar. Na quinta-feira, as aulas de PP são direcionadas ao Picture.\n\nA próxima cena começa com você.',
  },
].map((e) => ({
  ...(String(e.location || '').startsWith('IELUSC Campus Centro') ? IELUSC_CENTRO : {}),
  ...e,
  starts_at: toIso(e.starts_at),
  ends_at: toIso(e.ends_at),
  boost_until: toIso(e.boost_until),
}));

export const DEMO_ACCOUNTS = [
  { email: 'aluno@demo.com', password: 'demo123', label: 'Universitário' },
  { email: 'organizador@demo.com', password: 'demo123', label: 'Organizador' },
  { email: 'admin@demo.com', password: 'demo123', label: 'Admin' },
  { email: 'secretaria@demo.com', password: 'demo123', label: 'Secretaria' },
  { email: 'coordenacao@demo.com', password: 'demo123', label: 'Coordenação PP' },
];

export function demoSeed() {
  const created = new Date(Date.now() - 3 * 86400000).toISOString();
  const users = [
    { id: 'demo-aluno', email: 'aluno@demo.com', seedPassword: 'demo123' },
    { id: 'demo-org', email: 'organizador@demo.com', seedPassword: 'demo123' },
    { id: 'demo-admin', email: 'admin@demo.com', seedPassword: 'demo123' },
    { id: 'demo-secretaria', email: 'secretaria@demo.com', seedPassword: 'demo123' },
    { id: 'demo-coord', email: 'coordenacao@demo.com', seedPassword: 'demo123' },
  ];
  const profiles = [
    { id: 'demo-aluno', email: 'aluno@demo.com', name: 'Aluno Demo', role: 'student', institution_id: 'ielusc', course_id: 'PP', semester: 5, entry_year: 2024, class_group: 'PP 2024/1', student_number: '000123', secretaria_consent_at: created, onboarded: true, accepted_terms_at: created, created_at: created },
    // alunos fictícios só para a tela da secretaria no modo demonstração (sem login)
    { id: 'demo-aluna-2', email: 'aluna2@demo.com', name: 'Aluna Exemplo (Jornalismo)', role: 'student', institution_id: 'ielusc', course_id: 'JOR', semester: 3, entry_year: 2025, class_group: 'JOR 2025/1', student_number: '000456', secretaria_consent_at: created, onboarded: true, accepted_terms_at: created, created_at: created },
    { id: 'demo-aluno-3', email: 'aluno3@demo.com', name: 'Aluno Exemplo (sem autorização)', role: 'student', institution_id: 'ielusc', course_id: 'PP', semester: 3, entry_year: 2025, onboarded: true, accepted_terms_at: created, created_at: created },
    { id: 'demo-secretaria', email: 'secretaria@demo.com', name: 'Secretaria Acadêmica (demo)', role: 'secretaria', institution_id: 'ielusc', onboarded: true, accepted_terms_at: created, created_at: created },
    { id: 'demo-coord', email: 'coordenacao@demo.com', name: 'Coordenação de PP (demo)', role: 'coordenador', institution_id: 'ielusc', course_id: 'PP', onboarded: true, accepted_terms_at: created, created_at: created },
    { id: 'demo-org', email: 'organizador@demo.com', name: 'Organizador Demo', role: 'organizer', org_name: 'Centro Acadêmico (exemplo)', org_instagram: '', org_status: 'approved', onboarded: true, accepted_terms_at: created, created_at: created },
    { id: 'demo-admin', email: 'admin@demo.com', name: 'Equipe Àquelas Horas', role: 'admin', onboarded: true, accepted_terms_at: created, created_at: created },
  ];
  const certificates = [
    { id: 'c-1', user_id: 'demo-aluno', title: 'Congresso de Comunicação (ouvinte)', type_key: 'part_eventos', hours: 20, issued_on: '2026-04-12', issuer: 'Exemplo', status: 'validado', created_at: created },
    { id: 'c-2', user_id: 'demo-aluno', title: 'Curso de fotografia', type_key: 'capacitacao', hours: 40, issued_on: '2026-05-03', issuer: 'Exemplo', status: 'entregue', created_at: created },
    { id: 'c-3', user_id: 'demo-aluno', title: 'Projeto de extensão na comunidade', type_key: 'extensao', hours: 30, issued_on: '2026-06-20', issuer: 'Exemplo', status: 'guardado', created_at: created },
    { id: 'c-4', user_id: 'demo-aluno', title: 'Curso online de marketing digital', type_key: 'online', hours: 25, issued_on: '2026-08-15', issuer: 'Exemplo', status: 'guardado', created_at: created },
    { id: 'c-5', user_id: 'demo-aluna-2', title: 'Semana de Jornalismo (ouvinte)', type_key: 'part_eventos', hours: 12, issued_on: '2026-05-20', issuer: 'Exemplo', status: 'entregue', created_at: created },
    { id: 'c-6', user_id: 'demo-aluna-2', title: 'Monitoria de Redação', type_key: 'monitoria', hours: 30, issued_on: '2026-07-01', issuer: 'Exemplo', status: 'entregue', missing_requirements: ['assinatura'], created_at: created },
    { id: 'c-7', user_id: 'demo-aluno-3', title: 'Oficina de fotografia', type_key: 'capacitacao', hours: 8, issued_on: '2026-06-10', issuer: 'Exemplo', status: 'entregue', created_at: created },
  ];
  const interactions = [];
  const events = REAL_EVENTS.map((e) => ({ ...e, organizer_id: 'demo-org' }));
  return { seedVersion: SEED_VERSION, users, profiles, events, certificates, interactions, attendance: [] };
}

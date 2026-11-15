// Regras de horas complementares por instituição e curso.
// Fonte IELUSC: "Tabela de Equivalência e de Procedimentos de Validação de ACGs,
// Complemento da Resolução CES nº 35/2019" (PDF Horas Complementares).
// Fonte Mackenzie: Regulamento de Atividades Complementares do curso de Jornalismo (Anexo).
// Cada tipo de atividade tem `max` (teto total da categoria no curso) e, quando o
// regulamento manda, `per` (teto por certificado) com `perUnit` (trabalho, semestre…).

const IELUSC_COURSES = [
  { id: 'ADM', name: 'Administração', goal: 130 },
  { id: 'DIR', name: 'Direito', goal: 150 },
  { id: 'EDF', name: 'Educação Física', goal: 200 },
  { id: 'ENF', name: 'Enfermagem', goal: 130 },
  { id: 'FONO', name: 'Fonoaudiologia', goal: 160 },
  { id: 'NUT', name: 'Nutrição', goal: 180 },
  { id: 'JOR', name: 'Jornalismo', goal: 120 },
  { id: 'PSICO', name: 'Psicologia', goal: 120 },
  { id: 'PP', name: 'Publicidade e Propaganda', goal: 200 },
  { id: 'SIST', name: 'Sistemas de Informação', goal: 180 },
];

// Ordem das colunas na tabela: ADM, DIR, EDF, ENF, FONO/NUT, JOR, PSICO, PP, SIST
const COLS = ['ADM', 'DIR', 'EDF', 'ENF', 'FONO', 'JOR', 'PSICO', 'PP', 'SIST'];

function row(values, extra = {}) {
  const caps = {};
  COLS.forEach((c, i) => {
    caps[c] = values[i];
  });
  caps.NUT = caps.FONO; // FONO e NUT dividem a mesma coluna na tabela
  return { caps, ...extra };
}

const IELUSC_TYPES = [
  { key: 'apresentacao', label: 'Apresentação de trabalho científico em eventos', ...row([40, 90, 90, 40, 90, 90, 80, 90, 80], { per: 30, perUnit: 'trabalho' }) },
  { key: 'cultural_ies', label: 'Atividades de caráter cultural promovidas pela IES', ...row([30, 40, 60, 40, 60, 60, 60, 60, 60]) },
  { key: 'extensao', label: 'Atividades de extensão', ...row([40, 50, 90, 90, 120, 120, 80, 120, 90]) },
  { key: 'iniciacao', label: 'Atividades de iniciação científica', ...row([40, 50, 90, 90, 120, 120, 80, 120, 90]) },
  { key: 'capacitacao', label: 'Cursos de capacitação e atualização', ...row([30, 40, 60, 60, 60, 60, 60, 90, 60]) },
  { key: 'online', label: 'Cursos online ou a distância', ...row([30, 20, 40, 60, 60, 40, 40, 90, 40]) },
  { key: 'eletivas', label: 'Disciplinas eletivas', proof: 'Certificado/Histórico original e a ementa da disciplina.', ...row([30, 80, 80, 80, 120, 80, 80, 160, 80]) },
  { key: 'estagio', label: 'Estágio não obrigatório supervisionado', ...row([30, 50, 90, 90, 120, 100, 40, null, 40], { perByCourse: { DIR: { per: 30, perUnit: 'estágio' } } }) },
  { key: 'grupo_estudos', label: 'Grupo de estudos', ...row([30, 50, 30, 60, 60, 30, 60, 60, 30]) },
  { key: 'intercambio', label: 'Intercâmbio acadêmico', proof: 'Termo de convênio do programa de intercâmbio e Certificado/Declaração de participação.', ...row([60, 40, 120, 90, 120, 120, 120, 150, 120]) },
  { key: 'monitoria', label: 'Monitoria', ...row([30, 60, 90, 90, 120, 80, 100, 120, 90], { perByCourse: { DIR: { per: 30, perUnit: 'semestre' } } }) },
  { key: 'org_eventos', label: 'Organização de eventos', ...row([30, 40, 60, 40, 60, 60, 60, 60, 60]) },
  { key: 'concursos', label: 'Participação em concursos/prêmios', note: 'A coordenação avalia a pertinência do concurso ou prêmio.', ...row([40, 10, 10, 20, 20, 10, 40, 60, 10], { per: 5, perUnit: 'trabalho' }) },
  { key: 'part_eventos', label: 'Participação em eventos', ...row([30, 40, 60, 80, 100, 60, 60, 120, 40]) },
  { key: 'eventos_cient', label: 'Participação em eventos científicos e culturais', ...row([40, 60, 60, 60, 60, 60, 60, 60, 60]) },
  { key: 'esportivos', label: 'Participação em eventos esportivos e recreativos', ...row([60, 20, 60, 60, 60, 60, 60, 60, 60]) },
  { key: 'colegiados', label: 'Participação em órgãos colegiados (CES, CPA, DCE, Colegiado)', ...row([30, 40, 40, 40, 40, 40, 20, 60, 10]) },
  { key: 'publicacao', label: 'Publicação em periódicos acadêmicos e científicos', note: '40h por trabalho publicado na íntegra; 20h por resumo ou resenha.', ...row([40, 60, 90, 60, 90, 90, 100, 90, 100], { per: 40, perUnit: 'trabalho' }) },
  { key: 'representante', label: 'Representante de turma', ...row([80, 80, 80, 70, 80, 80, 80, 80, 60], { per: 10, perUnit: 'semestre', perByCourse: { EDF: { per: 20, perUnit: 'semestre' } } }) },
  { key: 'visitas', label: 'Visitas técnicas', ...row([30, 20, 20, 20, 20, 20, 40, 20, 20], { perByCourse: { DIR: { per: 5, perUnit: 'visita' } } }) },
];

const MACK_TYPES = [
  // Atividades acadêmicas
  { key: 'm51', code: '51', group: 'Acadêmicas', label: 'Cursos de extensão, especialização, capacitação, difusão cultural', per: 60, max: 180 },
  { key: 'm52', code: '52', group: 'Acadêmicas', label: 'Minicursos, oficinas e atividades laboratoriais', per: 70, max: 280 },
  { key: 'm53', code: '53', group: 'Acadêmicas', label: 'Cursos de língua estrangeira', per: 20, max: 100 },
  { key: 'm54', code: '54', group: 'Acadêmicas', label: 'Cursos de capacitação tecnológica', per: 20, max: 120 },
  { key: 'm55', code: '55', group: 'Acadêmicas', label: 'Programas de monitoria', per: 60, max: 180 },
  { key: 'm56', code: '56', group: 'Acadêmicas', label: 'Apoio acadêmico a eventos', per: 8, max: 40 },
  { key: 'm62', code: '62', group: 'Acadêmicas', label: 'Exame de proficiência em língua estrangeira', per: 10, max: 20 },
  { key: 'm58', code: '58', group: 'Acadêmicas', label: 'Agência Jr. do CCL', per: 60, max: 120 },
  { key: 'm59', code: '59', group: 'Acadêmicas', label: 'Projeto Incubadas', per: 150, max: 150 },
  { key: 'm97', code: '97', group: 'Acadêmicas', label: 'Ouvinte em seminários, semanas, congressos e eventos', per: 20, max: 80 },
  { key: 'm61', code: '61', group: 'Acadêmicas', label: 'Ouvinte em bancas (TGI, mestrado, doutorado)', per: 3, max: 30 },
  { key: 'm63', code: '63', group: 'Acadêmicas', label: 'Representante de classe', per: 20, max: 160 },
  // Atividades científicas
  { key: 'm64', code: '64', group: 'Científicas', label: 'Iniciação científica', per: 150, max: 150 },
  { key: 'm65', code: '65', group: 'Científicas', label: 'Grupos de estudos e pesquisa', per: 30, max: 60 },
  { key: 'm66', code: '66', group: 'Científicas', label: 'Apresentador em seminários, congressos e eventos', per: 15, max: 60 },
  { key: 'm67', code: '67', group: 'Científicas', label: 'Produção científica experimental', per: 30, max: 60 },
  { key: 'm68', code: '68', group: 'Científicas', label: 'Publicação em periódicos ou anais', per: 40, max: 80 },
  { key: 'm76', code: '76', group: 'Científicas', label: 'Portfólio', per: 70, max: 70 },
  // Atividades culturais
  { key: 'm69', code: '69', group: 'Culturais', label: 'Visitas a museus, feiras e exposições', per: 3, max: 30 },
  { key: 'm70', code: '70', group: 'Culturais', label: 'Visitas técnicas', per: 10, max: 50 },
  { key: 'm71', code: '71', group: 'Culturais', label: 'Filmes, peças, shows e manifestações culturais', per: 3, max: 30 },
  { key: 'm72', code: '72', group: 'Culturais', label: 'Intervenção social e voluntariado', per: 30, max: 90 },
  { key: 'm73', code: '73', group: 'Culturais', label: 'Concursos e premiações (participação)', per: 15, max: 60 },
  { key: 'm74', code: '74', group: 'Culturais', label: 'Premiação em concursos de notório reconhecimento', per: 60, max: 180 },
];

const GENERIC_TYPES = [
  { key: 'g_eventos', label: 'Participação em eventos, palestras e seminários' },
  { key: 'g_cursos', label: 'Cursos, oficinas e capacitações' },
  { key: 'g_online', label: 'Cursos online' },
  { key: 'g_extensao', label: 'Extensão e voluntariado' },
  { key: 'g_pesquisa', label: 'Pesquisa, iniciação científica e publicações' },
  { key: 'g_monitoria', label: 'Monitoria e representação estudantil' },
  { key: 'g_estagio', label: 'Estágio não obrigatório' },
  { key: 'g_cultura', label: 'Atividades culturais e esportivas' },
  { key: 'g_visitas', label: 'Visitas técnicas' },
  { key: 'g_outros', label: 'Outras atividades' },
];

// Categorias de evento (vitrine, no estilo do Joyn) e o tipo de atividade
// que cada uma costuma valer em cada instituição. O aluno pode trocar ao guardar.
export const EVENT_CATEGORIES = [
  { id: 'palestra', label: 'Palestras', icon: 'Mic', color: '#2563EB', map: { ielusc: 'part_eventos', mackenzie_jor: 'm97', outra: 'g_eventos' } },
  { id: 'curso', label: 'Cursos e oficinas', icon: 'GraduationCap', color: '#7C3AED', map: { ielusc: 'capacitacao', mackenzie_jor: 'm52', outra: 'g_cursos' } },
  { id: 'cientifico', label: 'Científicos', icon: 'FlaskConical', color: '#0891B2', map: { ielusc: 'eventos_cient', mackenzie_jor: 'm97', outra: 'g_pesquisa' } },
  { id: 'cultura', label: 'Cultura', icon: 'Palette', color: '#DB2777', map: { ielusc: 'eventos_cient', mackenzie_jor: 'm71', outra: 'g_cultura' } },
  { id: 'extensao', label: 'Voluntariado', icon: 'HeartHandshake', color: '#16A34A', map: { ielusc: 'extensao', mackenzie_jor: 'm72', outra: 'g_extensao' } },
  { id: 'esporte', label: 'Esportes', icon: 'Trophy', color: '#EA580C', map: { ielusc: 'esportivos', mackenzie_jor: null, outra: 'g_cultura' } },
  { id: 'visita', label: 'Visitas técnicas', icon: 'Building2', color: '#475569', map: { ielusc: 'visitas', mackenzie_jor: 'm70', outra: 'g_visitas' } },
  { id: 'concurso', label: 'Concursos', icon: 'Award', color: '#0284C7', map: { ielusc: 'concursos', mackenzie_jor: 'm73', outra: 'g_outros' } },
  { id: 'online', label: 'Online', icon: 'MonitorPlay', color: '#0D9488', map: { ielusc: 'online', mackenzie_jor: 'm54', outra: 'g_online' } },
  { id: 'outros', label: 'Outros', icon: 'LayoutGrid', color: '#64748B', map: { ielusc: 'part_eventos', mackenzie_jor: 'm97', outra: 'g_outros' } },
];

export const INSTITUTIONS = [
  {
    id: 'ielusc',
    name: 'Faculdade IELUSC',
    city: 'Joinville',
    source: 'Resolução CES nº 35/2019, tabela de equivalência de ACGs',
    courses: IELUSC_COURSES,
    types: IELUSC_TYPES,
  },
  {
    id: 'mackenzie_jor',
    name: 'Mackenzie',
    city: 'São Paulo',
    source: 'Regulamento de Atividades Complementares do curso de Jornalismo',
    courses: [{ id: 'JOR', name: 'Jornalismo', goal: 300 }],
    types: MACK_TYPES,
  },
  {
    id: 'outra',
    name: 'Outra instituição',
    city: '',
    source: 'Meta definida por você',
    courses: [{ id: 'OUTRO', name: 'Meu curso', goal: null }],
    types: GENERIC_TYPES,
    custom: true,
  },
];

export function getInstitution(id) {
  return INSTITUTIONS.find((i) => i.id === id) || INSTITUTIONS[0];
}

export function getCourse(instId, courseId) {
  const inst = getInstitution(instId);
  return inst.courses.find((c) => c.id === courseId) || inst.courses[0];
}

// Lista de tipos de atividade válidos para o curso, já com teto e limite por item resolvidos.
export function typesFor(instId, courseId) {
  const inst = getInstitution(instId);
  return inst.types
    .map((t) => {
      const max = t.caps ? t.caps[courseId] ?? null : t.max ?? null;
      const override = t.perByCourse?.[courseId];
      const per = override ? override.per : t.per ?? null;
      const perUnit = override ? override.perUnit : t.perUnit ?? null;
      const notAccepted = t.caps ? t.caps[courseId] === null : false;
      return { key: t.key, code: t.code, group: t.group, label: t.label, note: t.note, proof: t.proof, max, per, perUnit, notAccepted };
    })
    .filter((t) => !t.notAccepted);
}

export function typeLabel(instId, key) {
  const inst = getInstitution(instId);
  const t = inst.types.find((x) => x.key === key);
  if (t) return t.code ? `${t.code} · ${t.label}` : t.label;
  // tipo de outra instituição (aluno trocou de curso): procura em todas
  for (const i of INSTITUTIONS) {
    const y = i.types.find((x) => x.key === key);
    if (y) return y.label;
  }
  return 'Atividade complementar';
}

export function goalFor(profile) {
  if (!profile) return 0;
  const inst = getInstitution(profile.institution_id);
  if (inst.custom) return Number(profile.goal_hours) || 0;
  return getCourse(profile.institution_id, profile.course_id).goal;
}

export function eventCategory(id) {
  return EVENT_CATEGORIES.find((c) => c.id === id) || EVENT_CATEGORIES[EVENT_CATEGORIES.length - 1];
}

export function typeForEvent(profile, category) {
  const cat = eventCategory(category);
  const key = cat.map[profile?.institution_id || 'ielusc'];
  if (!key) return null;
  const valid = typesFor(profile?.institution_id || 'ielusc', profile?.course_id || 'PP').some((t) => t.key === key);
  return valid ? key : null;
}

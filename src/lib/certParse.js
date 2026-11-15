// Lê o texto de um certificado (vindo do PDF ou do OCR da foto) e sugere os campos do formulário.
// Tudo roda no aparelho do aluno; nada é enviado para servidor.
import { typesFor } from './rules.js';

const MONTHS = {
  janeiro: 1, fevereiro: 2, 'março': 3, marco: 3, abril: 4, maio: 5, junho: 6,
  julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12,
};

const NUMBER_WORDS = {
  um: 1, uma: 1, dois: 2, duas: 2, 'três': 3, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9,
  dez: 10, onze: 11, doze: 12, treze: 13, quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17,
  dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70,
  oitenta: 80, noventa: 90, cem: 100, cento: 100,
};

export function normalizeText(raw = '') {
  return raw
    .replace(/\r/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/-\n(?=[a-zà-ú])/g, '') // palavra quebrada no fim da linha
    .trim();
}

// texto "corrido" (sem quebras) para as buscas por frase
const flat = (t) => t.replace(/\s*\n\s*/g, ' ');

function toNumber(s) {
  return Number(String(s).replace(',', '.'));
}

export function findHours(text) {
  const t = flat(text);
  const unit = String.raw`(?:h\b|hs\b|hrs?\b|horas?(?:[\s-]aula)?|h\/a)`;
  const num = String.raw`(\d{1,4}(?:[.,]\d{1,2})?)`;
  const patterns = [
    // "carga horária de 4 horas", "totalizando 15 horas", "com duração de 8h"
    new RegExp(String.raw`(?:carga\s*hor[aá]ria|totalizando|num\s+total\s+de|no\s+total\s+de|total\s+de|com\s+dura[cç][aã]o\s+de|dura[cç][aã]o\s*:?)\D{0,25}?${num}\s*${unit}`, 'i'),
    // "carga horária: 04:00"
    /carga\s*hor[aá]ria\D{0,15}?(\d{1,3}):(\d{2})/i,
    // "carga horária: 20"
    /carga\s*hor[aá]ria\s*:?\s*(?:de\s*)?(\d{1,4}(?:[.,]\d{1,2})?)\b/i,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) {
      const h = m[2] && re.source.includes(':(') ? toNumber(m[1]) + toNumber(m[2]) / 60 : toNumber(m[1]);
      if (h > 0 && h <= 2000) return round(h);
    }
  }
  // "15 horas complementares", "20h" (sem pegar horário do dia, ex.: "às 19 horas", "19h30")
  const loose = new RegExp(String.raw`(?<!às\s|as\s|das\s|partir\sdas\s)\b${num}\s*(?:horas?|hrs?|h)(?![\d:]|\s*(?:e\s*)?\d{2}\b)`, 'gi');
  const found = [...t.matchAll(loose)].map((m) => toNumber(m[1])).filter((h) => h > 0 && h <= 400);
  if (found.length) return round(Math.max(...found));
  // por extenso: "quinze horas"
  const words = t.toLowerCase().match(/\b([a-zçêã]+)(?:\s+e\s+([a-zçêã]+))?\s+horas?\b/);
  if (words) {
    const a = NUMBER_WORDS[words[1]] || 0;
    const b = NUMBER_WORDS[words[2]] || 0;
    if (a + b > 0) return a + b;
  }
  return null;
}
const round = (h) => Math.round(h * 10) / 10;

export function findDate(text, today = new Date()) {
  const t = flat(text).toLowerCase();
  const dates = [];
  const push = (d, m, y) => {
    d = Number(d);
    m = Number(m);
    y = y ? Number(y < 100 ? 2000 + Number(y) : y) : null;
    if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12)) return;
    // ano lido errado pelo OCR (ex.: "20726"): trata como se não tivesse ano
    if (y && (y < 1990 || y > today.getFullYear() + 1)) y = null;
    if (!y) {
      // sem ano: assume o ano mais recente que não fica no futuro
      y = today.getFullYear();
      if (new Date(y, m - 1, d) > today) y -= 1;
    }
    if (y < 1990 || y > today.getFullYear() + 1) return;
    dates.push(new Date(Date.UTC(y, m - 1, d)));
  };
  for (const m of t.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/g)) push(m[1], m[2], m[3]);
  const monthNames = Object.keys(MONTHS).join('|');
  const re = new RegExp(String.raw`\b(\d{1,2})(?:º|°)?\s*(?:a|e|até)?\s*(?:\d{1,2}\s*)?de\s+(${monthNames})(?:\s+de\s+(\d{4,5}))?`, 'g');
  for (const m of t.matchAll(re)) push(m[1], MONTHS[m[2]], m[3]);
  // "entre 11 e 14 de novembro": pega o último dia
  const range = new RegExp(String.raw`\b\d{1,2}\s*(?:a|e|até)\s*(\d{1,2})\s+de\s+(${monthNames})(?:\s+de\s+(\d{4,5}))?`, 'g');
  for (const m of t.matchAll(range)) push(m[1], MONTHS[m[2]], m[3]);
  if (!dates.length) return null;
  const notFuture = dates.filter((d) => d <= today);
  const pick = (notFuture.length ? notFuture : dates).sort((a, b) => b - a)[0];
  return pick.toISOString().slice(0, 10);
}

const ISSUER_WORDS = String.raw`Faculdade|Universidade|Centro Universit[aá]rio|Instituto|Institui[cç][aã]o|Associa[cç][aã]o|Funda[cç][aã]o|Escola|Col[eé]gio|Sindicato|Prefeitura|Secretaria|SEBRAE|SENAC|SENAI|SESC|SESI|IELUSC|UNIVILLE|UDESC|UFSC|Cat[oó]lica|Mackenzie|APP Brasil|Alura|Udemy|Coursera|Google|HubSpot|Rock Content|Sympla|ESPM`;

function cleanIssuer(s) {
  let v = s
    .replace(/^(?:a|o|as|os|da|do|das|dos|pela|pelo)\s+/i, '')
    .replace(/\s+(?:e|com|em|no|na|para|através|ao longo).*$/i, '')
    .replace(/[\s,.;:-]+$/, '')
    .trim();
  if (/^ielusc$/i.test(v) || /^faculdade ielusc$/i.test(v)) v = 'Faculdade IELUSC';
  return v.length >= 3 && v.length <= 80 ? v : null;
}

export function findIssuer(text) {
  const t = flat(text);
  const by = t.match(/(?:promovid[oa]|realizad[oa]|organizad[oa]|oferecid[oa]|emitid[oa]|ministrad[oa])\s+(?:pel[oa]s?|por)\s+([^,.;]{3,80})/i);
  if (by) {
    const v = cleanIssuer(by[1]);
    if (v && new RegExp(ISSUER_WORDS, 'i').test(v)) return v;
  }
  const inst = t.match(new RegExp(String.raw`\b((?:${ISSUER_WORDS})(?:\s+(?:de|do|da|dos|das|e)?\s*[A-ZÀ-Ú][\wÀ-ú.-]*){0,6})`, 'i'));
  if (inst) return cleanIssuer(inst[1]);
  if (by) return cleanIssuer(by[1]);
  // logos lidos pelo OCR costumam sair tortos: "/ELUse", "IELUSE", "eLúsc"
  const plain = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/(?:^|[\s|/])[|/il1]?\s?elus[ce]\b/i.test(plain)) return 'Faculdade IELUSC';
  // "Coordenador do Curso / Publicidade e Propaganda" (nome do curso na mesma linha ou na seguinte)
  const lines = text.split('\n').map((l) => l.trim());
  const i = lines.findIndex((l) => /coordena(?:dor[a]?|[cç][aã]o)\s+(?:do|da)\s+curso/i.test(l));
  if (i !== -1) {
    const rest = lines[i].replace(/.*curso\s*(?:de\s+)?/i, '').trim() || lines[i + 1] || '';
    const course = rest.match(/^[A-ZÀ-Ú][\wÀ-ú]*(?:\s+(?:e|de|da|do|em)?\s*[A-ZÀ-Ú][\wÀ-ú]*){0,5}/);
    if (course) return `Curso de ${course[0]}`.slice(0, 80);
  }
  return null;
}

const EVENT_WORDS = String.raw`Congresso|Semana|Simp[oó]sio|Semin[aá]rio|Jornada|Encontro|Workshop|Oficina|Minicurso|Curso|Palestra|Feira|Mostra|F[oó]rum|Confer[eê]ncia|Concurso|Festival|Webinar|Treinamento|Projeto|Programa|Bootcamp|Imers[aã]o|Ciclo|Col[oó]quio|Hackathon|Maratona`;
const ROLE_START = /^(?:a\s+|o\s+)?(?:comiss[aã]o|organiza|monitor|ouvinte|palestrante|apresenta|volunt[aá]ri|participante|membro|mediador|avaliador|banca)/i;
const STOP = String.raw`(?=\s*(?:[,.;(]|\bque\b|\brealizad|\bpromovid|\bocorrid|\bministrad|\bcom carga|\bcom dura|\bno dia|\bnos dias|\bno per[ií]odo|\bentre\b|\bem \d|\bde \d|\btotalizando|\bdurante|\bcarga|\bcom \d|$))`;

function tidyTitle(s, profileName) {
  let v = s
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^["'\s]+|["'\s,.;:-]+$/g, '')
    .trim();
  if (v.length > 120) v = v.slice(0, 120).replace(/\s+\S*$/, '');
  if (!v || v.length < 3) return null;
  if (profileName && namesMatch(v, profileName)) return null;
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function findTitle(text, profileName) {
  const t = flat(text);
  const part = t.match(new RegExp(String.raw`(?:participou|participa[cç][aã]o|esteve presente|concluiu|realizou|frequentou|apresentou(?:\s+o\s+trabalho)?)\s+(?:com\s+[eê]xito\s+)?(?:d[oa]s?|n[oa]s?|o|a|em|de)\s+(.+?)${STOP}`, 'i'));
  if (part && !ROLE_START.test(part[1])) {
    const v = tidyTitle(part[1], profileName);
    if (v) return v;
  }
  const ev = t.match(new RegExp(String.raw`\b((?:[IVXL]+|\d{1,2}[ºª°]?)?\s*(?:${EVENT_WORDS})\b.+?)${STOP}`, 'i'));
  if (ev) {
    const v = tidyTitle(ev[1], profileName);
    if (v) return v;
  }
  return null;
}

// Palavras-chave → tipo de atividade (chaves da tabela IELUSC); traduzidas depois para a instituição do aluno.
const TYPE_RULES = [
  ['representante', /representante de (?:turma|classe)/],
  ['colegiados', /colegiado|\bdce\b|\bcpa\b|diret[oó]rio acad[eê]mico|centro acad[eê]mico/],
  ['monitoria', /\bmonitor(?:ia|a)?\b/],
  ['iniciacao', /inicia[cç][aã]o cient[ií]fica|\bpibic\b|\bpibiti\b|bolsista de pesquisa/],
  ['publicacao', /\bpublica(?:[cç][aã]o|do)\b|peri[oó]dico|\banais\b|\bissn\b|\bdoi\b/],
  ['apresentacao', /apresent(?:ou|a[cç][aã]o d[eo]) (?:o )?trabalho|comunica[cç][aã]o oral|p[oô]ster|apresentador/],
  ['org_eventos', /comiss[aã]o organizadora|organiza[cç][aã]o do evento|organizador|\borganizou\b/],
  ['concursos', /concurso|pr[eê]mio|premia[cç][aã]o|\bfinalista\b/],
  ['visitas', /visita t[eé]cnica/],
  ['esportivos', /esport|campeonato|torneio|olimp[ií]ada|jogos/],
  ['grupo_estudos', /grupo de estudos?/],
  ['estagio', /\best[aá]gio\b/],
  ['intercambio', /interc[aâ]mbio/],
  ['extensao', /extens[aã]o|volunt[aá]ri|a[cç][aã]o social|projeto social|comunidade/],
  ['eletivas', /disciplina eletiva|\beletiva\b/],
  ['online', /\bonline\b|\bead\b|a dist[aâ]ncia|alura|udemy|coursera|plataforma de ensino/],
  ['eventos_cient', /congresso|simp[oó]sio|semin[aá]rio|jornada|cient[ií]fic|col[oó]quio/],
  ['capacitacao', /\bcurso\b|oficina|workshop|minicurso|capacita[cç][aã]o|treinamento|bootcamp|imers[aã]o/],
  ['part_eventos', /palestra|semana|evento|participou|ouvinte|feira|f[oó]rum|confer[eê]ncia|webinar|encontro|\w+thon\b/],
];

const MACK = {
  representante: 'm63', monitoria: 'm55', iniciacao: 'm64', publicacao: 'm68', apresentacao: 'm66', org_eventos: 'm56',
  concursos: 'm73', visitas: 'm70', grupo_estudos: 'm65', extensao: 'm72', online: 'm54', eventos_cient: 'm97',
  capacitacao: 'm52', part_eventos: 'm97',
};
const GENERIC = {
  representante: 'g_monitoria', colegiados: 'g_monitoria', monitoria: 'g_monitoria', iniciacao: 'g_pesquisa', publicacao: 'g_pesquisa',
  apresentacao: 'g_pesquisa', org_eventos: 'g_eventos', concursos: 'g_outros', visitas: 'g_visitas', esportivos: 'g_cultura',
  grupo_estudos: 'g_pesquisa', estagio: 'g_estagio', intercambio: 'g_outros', extensao: 'g_extensao', eletivas: 'g_cursos',
  online: 'g_online', eventos_cient: 'g_eventos', capacitacao: 'g_cursos', part_eventos: 'g_eventos',
};

export function guessType(text, institutionId = 'ielusc', courseId = 'PP') {
  // tira menções ao curso de graduação e ao cargo de quem assina, que não dizem nada sobre o tipo de atividade
  const t = flat(text)
    .toLowerCase()
    .replace(/coordena\w*\s+d[oa]\s+curso[^,.;]*/g, ' ')
    .replace(/\bcursos?\s+de\s+(?:gradua[cç][aã]o\s+(?:em\s+)?)?(?:administra|publicidade|jornalismo|direito|enfermagem|psicologia|nutri|fonoaudiologia|educa[cç][aã]o f|sistemas|design|arquitetura)\w*/g, ' ');
  const valid = new Set(typesFor(institutionId, courseId).map((x) => x.key));
  // pontua cada tipo pelo número de palavras-chave; papéis específicos (monitor, organizador…) pesam mais.
  // Empate: vence o que vem primeiro na lista.
  const SPECIFIC = TYPE_RULES.findIndex(([k]) => k === 'extensao');
  let best = null;
  TYPE_RULES.forEach(([key, re], i) => {
    const hits = (t.match(new RegExp(re.source, 'g')) || []).length;
    if (!hits) return;
    const mapped = institutionId === 'ielusc' ? key : institutionId === 'mackenzie_jor' ? MACK[key] : GENERIC[key];
    if (!mapped || !valid.has(mapped)) return;
    const score = hits * (i < SPECIFIC ? 3 : 1);
    if (!best || score > best.score) best = { key: mapped, score };
  });
  return best?.key || null;
}

function namesMatch(a, b) {
  const norm = (s) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/\(\d+\)/g, '')
      .split(/[^a-z]+/)
      .filter((w) => w.length > 2);
  const A = norm(a);
  const B = new Set(norm(b));
  if (!A.length || !B.size) return false;
  const hits = A.filter((w) => B.has(w)).length;
  return hits >= Math.min(2, B.size) && hits / A.length >= 0.6;
}

// O nome do arquivo costuma ser o nome do aluno ("GABRIEL DOS SANTOS CARDOSO (1).pdf"): não serve de título.
export function titleFromFilename(filename, profileName) {
  const base = String(filename || '')
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\(\d+\)/g, '')
    .replace(/\b(certificado|certificate|cert)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!base || base.length < 3) return '';
  if (profileName && namesMatch(base, profileName)) return '';
  if (/^(img|image|scan|digitalizar|whatsapp|document|documento|arquivo|download)\b/i.test(base)) return '';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function parseCertificate(raw, { profile, today } = {}) {
  const text = normalizeText(raw);
  const name = profile?.name;
  return {
    title: findTitle(text, name),
    hours: findHours(text),
    issued_on: findDate(text, today),
    issuer: findIssuer(text),
    type_key: guessType(text, profile?.institution_id, profile?.course_id),
  };
}

// ---------------------------------------------------------------------------
// Requisitos para um certificado de horas ser aceito pela coordenação.
// Modelo: certificado do 8º Comunicathon (IELUSC, PP), que traz todos os itens obrigatórios:
// "Certificamos que [nome] participou do [evento], entre os dias [período], [instituição].
//  Totalizando [X] horas de atividade complementar. [assinatura] [nome do responsável] [cargo]".
// ---------------------------------------------------------------------------
export const CERT_REQUIREMENTS = [
  { key: 'name', label: 'Nome completo do participante', required: true, example: 'Gabriel dos Santos Cardoso' },
  { key: 'activity', label: 'Nome da atividade ou evento', required: true, example: '8º Comunicathon' },
  { key: 'participation', label: 'Como a pessoa participou', required: true, example: 'participou, organizou, apresentou, ministrou…' },
  { key: 'period', label: 'Data ou período de realização', required: true, example: 'entre os dias 11 a 22 de maio de 2026' },
  { key: 'issuer', label: 'Instituição ou organização responsável', required: true, example: 'Faculdade IELUSC' },
  { key: 'hours', label: 'Carga horária total', required: true, example: 'totalizando 20 horas de atividade complementar' },
  { key: 'signer', label: 'Assinatura com nome e cargo do responsável', required: true, example: 'Prof. Me. Vinicios Neves, Coordenador do Curso de PP' },
  { key: 'verification', label: 'Código, QR ou link de verificação', required: false, example: 'recomendado, não obrigatório' },
];

const PARTICIPATION_RE = /\b(participou|participa[cç][aã]o|participante|organizou|comiss[aã]o organizadora|apresentou|ministrou|concluiu|frequentou|ouvinte|monitor(?:ia)?|palestrante|esteve presente|atuou|integrou|colaborou)\b/i;
const SIGNER_RE = /\b(?:coordenador[a]?|diretor[a]?|presidente|reitor[a]?|vice-reitor[a]?|respons[aá]vel|chefe|gerente|ceo|fundador[a]?|secret[aá]ri[oa])\b|\bprof[ªa]?\.\s|\bprofessor[a]?\s+(?:dr|me|ms|esp)/i;
const VERIFY_RE = /(c[oó]digo|autenticidade|autentica[cç][aã]o|verifica[cç][aã]o|validar|valida[cç][aã]o|qr\s?code|https?:\/\/|www\.)/i;

function hasName(text, name) {
  if (!name) return false;
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const t = norm(text);
  const words = norm(name).split(/[^a-z]+/).filter((w) => w.length > 2);
  if (!words.length) return false;
  const hits = words.filter((w) => new RegExp(`\\b${w}\\b`).test(t)).length;
  return hits >= Math.min(2, words.length);
}

// Confere o texto lido do certificado contra os requisitos. `parsed` é o resultado de parseCertificate.
export function checkRequirements(raw, parsed, profile) {
  const text = normalizeText(raw);
  const ok = {
    name: hasName(text, profile?.name),
    activity: !!parsed?.title,
    participation: PARTICIPATION_RE.test(flat(text)),
    period: !!parsed?.issued_on,
    issuer: !!parsed?.issuer,
    hours: !!parsed?.hours,
    signer: SIGNER_RE.test(flat(text)),
    verification: VERIFY_RE.test(flat(text)),
  };
  return CERT_REQUIREMENTS.map((r) => ({ ...r, ok: ok[r.key] }));
}

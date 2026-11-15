// Catálogo de regulamentos de horas complementares (ACG) das instituições de Joinville-SC.
// Pesquisa feita em 15/11/2026 (fontes oficiais). Os dados ficam em JSON, um arquivo por instituição.
// Regra de qualidade: nenhum número sem fonte; o que é incerto fica marcado (situacao, a_confirmar, alertas).
import CATALOGO_GERADO from './catalogo.generated.js';

export const PESQUISA_EM = '15/11/2026';
export const AVISO_EMEC = 'O e-MEC bloqueou a consulta automática: a lista de instituições pode estar incompleta.';

export const CATALOGO = CATALOGO_GERADO;

// Onde ficam os PDFs. O repositório é público e leve: não levamos os 318 MB, só o link da fonte.
export const SITUACAO = {
  verificado: { label: 'Verificado', tom: 'ok' },
  a_confirmar: { label: 'A confirmar', tom: 'aviso' },
  contraditorio: { label: 'Fontes se contradizem', tom: 'alerta' },
  historico: { label: 'Número histórico', tom: 'alerta' },
  lido_so_no_buscador: { label: 'Lido só no buscador', tom: 'alerta' },
  nao_publicado: { label: 'Não publicado', tom: 'aviso' },
  nao_verificado: { label: 'Não verificado', tom: 'aviso' },
  zero_a_confirmar: { label: 'Zero a confirmar', tom: 'aviso' },
  referencia_outra_unidade: { label: 'Outra unidade (só referência)', tom: 'alerta' },
};

export const STATUS_NORMA = {
  vigente: { label: 'Vigente', tom: 'ok' },
  revogada: { label: 'Revogada', tom: 'alerta' },
  desatualizada: { label: 'Desatualizada', tom: 'aviso' },
  nao_publicada: { label: 'Não publicada', tom: 'aviso' },
};

export const EXTENSAO_LABEL = {
  nao: 'Não: a mesma hora não conta nas duas',
  sim: 'Sim: a mesma hora pode contar nas duas',
  parcial: 'Em parte (veja a regra)',
  a_confirmar: 'A confirmar com a secretaria',
  nao_se_aplica: 'Não se aplica',
};

export function getInstituicao(id) {
  return CATALOGO.find((i) => i.id === id) || null;
}

export function getCursoCatalogo(instId, cursoId) {
  const inst = getInstituicao(instId);
  return inst?.cursos.find((c) => c.id === cursoId) || null;
}

export function getNorma(inst, normaId) {
  return inst?.normas?.find((n) => n.id === normaId) || null;
}

export function formatHorasCatalogo(h) {
  if (!h || h.valor == null) return 'Sem número confiável';
  const u = h.unidade === 'pontos' ? 'pontos' : h.unidade || 'sem unidade informada';
  const eq = h.equivalente ? ` (= ${h.equivalente.valor} ${h.equivalente.unidade})` : '';
  return `${h.valor} ${u}${eq}`;
}

const NIVEL_ORDEM = { alto: 0, medio: 1, info: 2 };

// Alertas do curso + da instituição, mais graves primeiro. Nada é escondido.
export function alertasDoCurso(inst, curso) {
  const lista = [...(curso?.alertas || []), ...(inst?.alertas || [])];
  return lista.sort((a, b) => (NIVEL_ORDEM[a.nivel] ?? 3) - (NIVEL_ORDEM[b.nivel] ?? 3));
}

export function nivelMaisGrave(alertas) {
  if (alertas.some((a) => a.nivel === 'alto')) return 'alto';
  if (alertas.some((a) => a.nivel === 'medio')) return 'medio';
  return alertas.length ? 'info' : null;
}

function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Busca por instituição e curso. `ano` filtra matrizes pelo ano de ingresso quando o catálogo traz o corte.
export function buscarCatalogo({ texto = '', instituicaoId = '', ano = null } = {}) {
  const q = norm(texto).trim();
  const res = [];
  for (const inst of CATALOGO) {
    if (instituicaoId && inst.id !== instituicaoId) continue;
    const instMatch = q && (norm(inst.nome).includes(q) || norm(inst.sigla).includes(q));
    for (const curso of inst.cursos) {
      if (q && !instMatch && !norm(curso.nome).includes(q)) continue;
      if (ano && !matrizCobreAno(curso, ano)) continue;
      res.push({ inst, curso });
    }
  }
  return res;
}

// Tenta ler o ano a partir de "2024/1", "2024", etc.
function anoDe(s) {
  const m = String(s || '').match(/(20\d{2})/);
  return m ? Number(m[1]) : null;
}

// true se a matriz pode valer para quem ingressou em `ano`; sem corte conhecido, não exclui (o aluno vê e confirma).
export function matrizCobreAno(curso, ano) {
  const cod = String(curso.matriz?.codigo || '');
  // Sem corte explícito, só reconhecemos "a partir de AAAA" e "até AAAA" no texto da matriz.
  const de = anoDe(curso.matriz?.ingresso_de) ?? anoDe(cod.match(/a partir de\s+(20\d{2})/i)?.[1]);
  const ate = anoDe(curso.matriz?.ingresso_ate) ?? anoDe(cod.match(/\bat[eé]\s+(20\d{2})/i)?.[1]);
  if (de && ano < de) return false;
  if (ate && ano > ate) return false;
  return true;
}

// Cursos de uma instituição ordenados por nome, para o seletor do cadastro.
export function cursosDaInstituicao(instId) {
  const inst = getInstituicao(instId);
  return inst ? [...inst.cursos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')) : [];
}

// URL do PDF oficial: usa a URL de origem da norma aplicável; o caminho local fica para a equipe.
export function fonteOficial(inst, curso) {
  const norma = getNorma(inst, curso?.norma_aplicavel) || inst.normas.find((n) => n.status === 'vigente' && n.url);
  return norma?.url || curso?.horas?.fonte || '';
}

// Meta em horas-relógio para o acompanhamento, só quando o catálogo traz um número confiável em horas:
// unidade "h", ou "h/a" com equivalente em "h" informado na fonte. Fontes que se contradizem, números
// históricos, lidos só no buscador, de outra unidade, em créditos ou pontos NÃO viram meta: o aluno digita.
const SITUACOES_SEM_META = new Set(['contraditorio', 'historico', 'lido_so_no_buscador', 'referencia_outra_unidade', 'nao_publicado', 'nao_verificado', 'zero_a_confirmar']);
export function metaDoCatalogo(curso) {
  const h = curso?.horas;
  if (!h || h.valor == null || h.valor <= 0 || SITUACOES_SEM_META.has(h.situacao)) return null;
  if (h.unidade === 'h') return h.valor;
  if (h.unidade === 'h/a' && h.equivalente?.unidade === 'h') return h.equivalente.valor;
  return null;
}

// Funções da aba Secretaria (piloto IELUSC): filtros, resumo por aluno e planilhas CSV.
// Puras, sem React, para poder testar com `node --test`.
import { computeProgress } from './progress.js';
import { getCourse, typeLabel } from './rules.js';

// Faculdades com a aba Secretaria ligada. Só entra aqui quem combinou o piloto com a equipe.
export const SECRETARIA_PILOTO = ['ielusc'];
export const temSecretaria = (institutionId) => SECRETARIA_PILOTO.includes(institutionId);

export const STATUS_SEC = {
  entregue: 'Aguardando análise',
  validado: 'Validado',
  recusado: 'Recusado',
};

// Validado/recusado sem avaliação da secretaria = o próprio aluno marcou no cofre (autodeclarado).
export function situacao(c) {
  const base = STATUS_SEC[c.status] || c.status;
  return c.status !== 'entregue' && !c.reviewed_by ? `${base} (informado pelo aluno)` : base;
}

const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Aplica os filtros da tela. Um aluno aparece se ele e pelo menos um certificado passam no filtro
// (sem filtro de status, aparece mesmo sem certificados enviados).
export function filtrar(students, certificates, f = {}) {
  const q = norm(f.texto);
  const alunos = students.filter(
    (s) =>
      (!f.curso || s.course_id === f.curso) &&
      (!f.ano || String(s.entry_year || '') === String(f.ano)) &&
      (!f.turma || norm(s.class_group) === norm(f.turma)) &&
      (!q || norm(s.name).includes(q) || norm(s.email).includes(q) || norm(s.student_number).includes(q)),
  );
  const ids = new Set(alunos.map((s) => s.id));
  const certs = certificates.filter((c) => ids.has(c.user_id) && (!f.status || c.status === f.status));
  const comCert = new Set(certs.map((c) => c.user_id));
  return { alunos: f.status ? alunos.filter((s) => comCert.has(s.id)) : alunos, certs };
}

// Uma linha por aluno: meta do curso, horas que contam (regras do app), validadas e pendências.
export function resumoPorAluno(students, certificates) {
  return students.map((s) => {
    const mine = certificates.filter((c) => c.user_id === s.id);
    const p = computeProgress(s, mine);
    return {
      aluno: s,
      certs: mine,
      meta: p.goal,
      contam: p.counted,
      validadas: p.validated,
      pendentes: mine.filter((c) => c.status === 'entregue').length,
      recusados: mine.filter((c) => c.status === 'recusado').length,
    };
  });
}

export function totais(certificates) {
  return {
    entregue: certificates.filter((c) => c.status === 'entregue').length,
    validado: certificates.filter((c) => c.status === 'validado').length,
    recusado: certificates.filter((c) => c.status === 'recusado').length,
  };
}

// Célula de CSV segura: aspas, ponto e vírgula, quebra de linha e fórmulas (=, +, -, @) que o
// Excel executaria. Títulos de certificado vêm do aluno, então não confiamos neles.
export function celula(v) {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// CSV no padrão do Excel em português: separador ";", vírgula decimal e BOM para acentos.
export function toCsv(cabecalho, linhas) {
  const num = (v) => (typeof v === 'number' ? String(v).replace('.', ',') : v);
  return '﻿' + [cabecalho, ...linhas].map((l) => l.map((v) => celula(num(v))).join(';')).join('\r\n') + '\r\n';
}

const cursoNome = (s) => getCourse(s.institution_id, s.course_id)?.name || s.course_id || '';
const dataBR = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR') : '');

export function csvCertificados(students, certificates) {
  const porId = Object.fromEntries(students.map((s) => [s.id, s]));
  const cab = ['Matrícula', 'Nome', 'E-mail', 'Curso', 'Ano de ingresso', 'Turma', 'Certificado', 'Categoria', 'Horas', 'Data', 'Emissor', 'Situação', 'Observação da secretaria', 'Itens faltando no certificado', 'Avaliado em'];
  const linhas = certificates
    .filter((c) => porId[c.user_id])
    .map((c) => {
      const s = porId[c.user_id];
      return [
        s.student_number || '', s.name || '', s.email || '', cursoNome(s), s.entry_year || '', s.class_group || '',
        c.title || '', typeLabel(s.institution_id, c.type_key), Number(c.hours) || 0, dataBR(c.issued_on), c.issuer || '',
        situacao(c), c.review_note || '', (c.missing_requirements || []).join(', '), dataBR(c.reviewed_at),
      ];
    });
  return toCsv(cab, linhas);
}

export function csvResumo(students, certificates) {
  const cab = ['Matrícula', 'Nome', 'E-mail', 'Curso', 'Ano de ingresso', 'Turma', 'Meta (h)', 'Horas que contam (h)', 'Horas validadas (h)', 'Aguardando análise', 'Recusados'];
  const linhas = resumoPorAluno(students, certificates).map((r) => [
    r.aluno.student_number || '', r.aluno.name || '', r.aluno.email || '', cursoNome(r.aluno), r.aluno.entry_year || '', r.aluno.class_group || '',
    r.meta, r.contam, r.validadas, r.pendentes, r.recusados,
  ]);
  return toCsv(cab, linhas);
}

// Nome de arquivo com o filtro aplicado, ex.: secretaria-ielusc-certificados-PP-2025-2026-11-15.csv
export function nomeArquivo(tipo, instId, f = {}) {
  const partes = ['secretaria', instId, tipo, f.curso, f.ano, f.turma, new Date().toISOString().slice(0, 10)].filter(Boolean);
  return `${partes.join('-').replace(/[^\w.-]+/g, '_')}.csv`;
}

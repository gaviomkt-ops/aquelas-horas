import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCertificate, titleFromFilename, findHours, findDate, checkRequirements } from './certParse.js';

const profile = { name: 'Gabriel dos Santos Cardoso', institution_id: 'ielusc', course_id: 'PP' };
const today = new Date('2026-11-15T12:00:00Z');

test('certificado do FLOW (texto como sai do OCR)', () => {
  const raw = `CERTIFICADO
ESTE CERTIFICADO COMPROVA QUE
Gabriel dos Santos Cardoso
Participou do FLOW a semana de eventos de Publicidade e Propaganda que
conduz os estudantes do insight ao impacto, realizada entre 11 e 14 de
novembro de 2025. Ao longo dos quatro dias, o participante acompanhou
palestras, oficinas e atividades formativas, totalizando 15 horas
complementares.
VINICIOS NEVES
Coordenador do Curso
Publicidade e Propaganda
FACULDADE IELUSC`;
  const r = parseCertificate(raw, { profile, today });
  assert.equal(r.hours, 15);
  assert.equal(r.issued_on, '2025-11-14');
  assert.equal(r.title, 'FLOW a semana de eventos de Publicidade e Propaganda');
  assert.equal(r.issuer, 'Faculdade IELUSC');
  assert.equal(r.type_key, 'part_eventos');
});

test('certificado do CONIPE (comissão organizadora, sem horas)', () => {
  const raw =
    'CERTIFICADO Certificamos que GABRIEL DOS SANTOS CARDOSO participou da comissão organizadora (CONGRESSISTA), Congresso Integrado de Pesquisa e Extensão, da Faculdade Ielusc.';
  const r = parseCertificate(raw, { profile, today });
  assert.equal(r.title, 'Congresso Integrado de Pesquisa e Extensão');
  assert.equal(r.issuer, 'Faculdade IELUSC');
  assert.equal(r.type_key, 'org_eventos');
  assert.equal(r.hours, null);
});

test('formatos comuns de carga horária e data', () => {
  assert.equal(findHours('com carga horária de 4 (quatro) horas'), 4);
  assert.equal(findHours('Carga horária: 20h'), 20);
  assert.equal(findHours('carga horária: 08:30'), 8.5);
  assert.equal(findHours('realizado no dia 10/03, às 19 horas, com duração de 2 horas'), 2);
  assert.equal(findHours('totalizando quinze horas de atividades'), 15);
  assert.equal(findHours('evento às 19h30 no auditório'), null);
  assert.equal(findDate('Joinville, 03 de maio de 2026.', today), '2026-05-03');
  assert.equal(findDate('emitido em 12/08/2026', today), '2026-08-12');
  assert.equal(findDate('realizada em 03 de outubro de 20726', today), '2026-10-03'); // ano lido errado pelo OCR
});

test('curso online com emissor', () => {
  const raw = 'Certificamos que Gabriel concluiu o curso Fundamentos de Marketing Digital, oferecido pela Escola Superior de Propaganda, na modalidade online, com carga horária de 30 horas. São Paulo, 2 de setembro de 2026.';
  const r = parseCertificate(raw, { profile, today });
  assert.equal(r.title, 'Curso Fundamentos de Marketing Digital');
  assert.equal(r.hours, 30);
  assert.equal(r.issued_on, '2026-09-02');
  assert.equal(r.type_key, 'online');
  assert.match(r.issuer, /Escola Superior de Propaganda/);
});

test('nome do arquivo igual ao nome do aluno não vira título', () => {
  assert.equal(titleFromFilename('GABRIEL DOS SANTOS CARDOSO (1).pdf', profile.name), '');
  assert.equal(titleFromFilename('conipe_certificado_GABRIEL_DOS_SANTOS_CARDOSO.pdf', profile.name), '');
  assert.equal(titleFromFilename('Certificado Flow.png', profile.name), 'Flow');
});

test('texto real do OCR do certificado do FLOW (logo lido torto)', () => {
  const raw = '\n\nESTE CERTIFICADO COMPROVA QUE\nFF.\nParticipou do FLOW a semana de eventos de Publicidade e Propaganda que\nconduz os estudantes do insight ao impacto, realizada entre 11 e 14 de\nnovembro de 2025. Ao longo dos quatro dias, o participante acompanhou\npalestras, oficinas e atividades formativas, totalizando 15 horas\ncomplementares. MM\nVINICIOS NEVES\nCoordenador do Curso\nPublicidade e Propaganda\nSCOW /ELUse\n';
  const r = parseCertificate(raw, { profile, today });
  assert.deepEqual(r, {
    title: 'FLOW a semana de eventos de Publicidade e Propaganda',
    hours: 15,
    issued_on: '2025-11-14',
    issuer: 'Faculdade IELUSC',
    type_key: 'part_eventos',
  });
});

const COMUNICATHON = `Certificamos que
Gabriel dos Santos Cardoso
Participou do 8º COMUNICATHON, que reuniu, entre os dias 11 a 22 de
maio de 2026, estudantes e professores da faculdade IELUSC, dos
cursos de Administração e Publicidade e Propaganda.
Totalizando 20 Horas de atividade complementar.
Prof. Me. Vinicios Neves
Coordenador do Curso de Publicidade e Propaganda`;

test('certificado modelo (8º Comunicathon): campos e requisitos', () => {
  const r = parseCertificate(COMUNICATHON, { profile, today });
  assert.equal(r.title, '8º COMUNICATHON');
  assert.equal(r.hours, 20);
  assert.equal(r.issued_on, '2026-05-22');
  assert.equal(r.issuer, 'Faculdade IELUSC');
  assert.equal(r.type_key, 'part_eventos');
  const check = checkRequirements(COMUNICATHON, r, profile);
  const missing = check.filter((c) => c.required && !c.ok).map((c) => c.key);
  assert.deepEqual(missing, []);
  assert.equal(check.find((c) => c.key === 'verification').ok, false);
});

test('certificado sem carga horária e sem assinatura aponta o que falta', () => {
  const raw = 'Certificamos que Gabriel dos Santos Cardoso participou da comissão organizadora, Congresso Integrado de Pesquisa e Extensão, da Faculdade Ielusc.';
  const r = parseCertificate(raw, { profile, today });
  const missing = checkRequirements(raw, r, profile).filter((c) => c.required && !c.ok).map((c) => c.key);
  assert.deepEqual(missing, ['period', 'hours', 'signer']);
});

test('certificado em nome de outra pessoa não passa no nome', () => {
  const raw = 'Certificamos que Maria Souza participou do Workshop de Branding, em 10/10/2026, com carga horária de 4 horas. Prof. João Lima, Coordenador.';
  const r = parseCertificate(raw, { profile, today });
  assert.equal(checkRequirements(raw, r, profile).find((c) => c.key === 'name').ok, false);
});

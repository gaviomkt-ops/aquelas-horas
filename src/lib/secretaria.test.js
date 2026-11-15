import test from 'node:test';
import assert from 'node:assert/strict';
import { celula, csvCertificados, csvResumo, filtrar, resumoPorAluno, temSecretaria, toCsv, totais, nomeArquivo } from './secretaria.js';

const alunos = [
  { id: 'a', name: 'Ana Souza', email: 'ana@x.com', institution_id: 'ielusc', course_id: 'PP', entry_year: 2024, class_group: 'PP 2024/1', student_number: '111' },
  { id: 'b', name: 'Bruno Lima', email: 'bruno@x.com', institution_id: 'ielusc', course_id: 'JOR', entry_year: 2025, class_group: 'JOR 2025/1', student_number: '222' },
];
const certs = [
  { id: '1', user_id: 'a', title: 'Congresso', type_key: 'part_eventos', hours: 20, status: 'validado', issued_on: '2026-04-12' },
  { id: '2', user_id: 'a', title: '=HYPERLINK("http://mal")', type_key: 'capacitacao', hours: 10.5, status: 'entregue', issued_on: '2026-05-03' },
  { id: '3', user_id: 'b', title: 'Monitoria; redação', type_key: 'monitoria', hours: 30, status: 'recusado', review_note: 'Sem assinatura', issued_on: '2026-07-01' },
];

test('piloto só no IELUSC', () => {
  assert.equal(temSecretaria('ielusc'), true);
  assert.equal(temSecretaria('univille'), false);
});

test('filtros por curso, ano, turma, status e busca', () => {
  assert.equal(filtrar(alunos, certs, { curso: 'PP' }).alunos.length, 1);
  assert.equal(filtrar(alunos, certs, { ano: 2025 }).alunos[0].id, 'b');
  assert.equal(filtrar(alunos, certs, { turma: 'pp 2024/1' }).alunos[0].id, 'a');
  const pend = filtrar(alunos, certs, { status: 'entregue' });
  assert.deepEqual(pend.alunos.map((a) => a.id), ['a']);
  assert.deepEqual(pend.certs.map((c) => c.id), ['2']);
  assert.equal(filtrar(alunos, certs, { texto: '222' }).alunos[0].id, 'b');
  assert.equal(filtrar(alunos, certs, { texto: 'brúno' }).alunos.length, 1);
  assert.deepEqual(totais(certs), { entregue: 1, validado: 1, recusado: 1 });
});

test('resumo por aluno: recusado não conta, validado conta como validado', () => {
  const [a, b] = resumoPorAluno(alunos, certs);
  assert.equal(a.meta, 200); // tabela atual do app para PP
  assert.equal(a.contam, 30.5);
  assert.equal(a.validadas, 20);
  assert.equal(a.pendentes, 1);
  assert.equal(b.contam, 0);
  assert.equal(b.recusados, 1);
});

test('CSV seguro para Excel: BOM, ponto e vírgula, vírgula decimal e sem fórmula', () => {
  assert.equal(celula('=SOMA(A1)'), "'=SOMA(A1)");
  assert.equal(celula('+55 47'), "'+55 47");
  assert.equal(celula('@x'), "'@x");
  assert.equal(celula('a;b'), '"a;b"');
  assert.equal(celula('diz "oi"'), '"diz ""oi"""');
  const csv = toCsv(['A', 'B'], [[1.5, 'x']]);
  assert.ok(csv.startsWith('﻿A;B\r\n1,5;x'));
  const cert = csvCertificados(alunos, certs);
  assert.ok(cert.includes(`'=HYPERLINK`));
  assert.ok(!/;=HYPERLINK/.test(cert));
  assert.ok(cert.includes('"Monitoria; redação"'));
  assert.ok(cert.includes('Sem assinatura'));
  assert.equal(cert.trim().split('\r\n').length, 4);
  const res = csvResumo(alunos, certs);
  assert.ok(res.includes('111;Ana Souza'));
  assert.ok(res.includes('30,5'));
});

test('validado pelo aluno aparece como autodeclarado', async () => {
  const { situacao } = await import('./secretaria.js');
  assert.equal(situacao({ status: 'validado' }), 'Validado (informado pelo aluno)');
  assert.equal(situacao({ status: 'validado', reviewed_by: 'sec' }), 'Validado');
  assert.equal(situacao({ status: 'entregue' }), 'Aguardando análise');
});

test('nome do arquivo leva o filtro', () => {
  assert.match(nomeArquivo('certificados', 'ielusc', { curso: 'PP', ano: 2025 }), /^secretaria-ielusc-certificados-PP-2025-\d{4}-\d{2}-\d{2}\.csv$/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeProgress, roomInType } from './progress.js';
import { typesFor, goalFor } from './rules.js';

const pp = { institution_id: 'ielusc', course_id: 'PP' };

test('meta do curso vem da tabela', () => {
  assert.equal(goalFor(pp), 200);
  assert.equal(goalFor({ institution_id: 'ielusc', course_id: 'NUT' }), 180);
  assert.equal(goalFor({ institution_id: 'outra', course_id: 'OUTRO', goal_hours: 250 }), 250);
});

test('FONO e NUT usam a mesma coluna; PP não aceita estágio', () => {
  const fono = typesFor('ielusc', 'FONO').find((t) => t.key === 'extensao');
  const nut = typesFor('ielusc', 'NUT').find((t) => t.key === 'extensao');
  assert.equal(fono.max, 120);
  assert.equal(nut.max, 120);
  assert.equal(typesFor('ielusc', 'PP').some((t) => t.key === 'estagio'), false);
});

test('limite por item e teto da categoria', () => {
  const certs = [
    { id: 1, type_key: 'apresentacao', hours: 40, issued_on: '2026-01-01' }, // vira 30 (por trabalho)
    { id: 2, type_key: 'apresentacao', hours: 30, issued_on: '2026-02-01' },
    { id: 3, type_key: 'apresentacao', hours: 30, issued_on: '2026-03-01' }, // teto PP = 90 → conta 30
    { id: 4, type_key: 'apresentacao', hours: 30, issued_on: '2026-04-01' }, // não conta
  ];
  const p = computeProgress(pp, certs);
  const t = p.types.find((x) => x.key === 'apresentacao');
  assert.equal(t.counted, 90);
  assert.equal(t.raw, 130);
  assert.equal(p.counted, 90);
  assert.equal(p.lost, 40);
  assert.equal(roomInType(p, 'apresentacao'), 0);
});

test('recusado não conta e meta limita o total', () => {
  const certs = [
    { id: 1, type_key: 'eletivas', hours: 160, issued_on: '2026-01-01', status: 'validado' },
    { id: 2, type_key: 'part_eventos', hours: 120, issued_on: '2026-01-02' },
    { id: 3, type_key: 'extensao', hours: 50, issued_on: '2026-01-03', status: 'recusado' },
  ];
  const p = computeProgress(pp, certs);
  assert.equal(p.counted, 200);
  assert.equal(p.done, true);
  assert.equal(p.overGoal, 80);
  assert.equal(p.validated, 160);
});

test('regra específica de curso: Direito visitas 5h por visita', () => {
  const p = computeProgress({ institution_id: 'ielusc', course_id: 'DIR' }, [
    { id: 1, type_key: 'visitas', hours: 8, issued_on: '2026-01-01' },
  ]);
  assert.equal(p.counted, 5);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coordinatesEvent, isStudentLike } from './roles.js';

const coordPP = { role: 'coordenador', institution_id: 'ielusc', course_id: 'PP' };

test('coordenador aprova evento do seu curso ou sem curso marcado', () => {
  assert.equal(coordinatesEvent(coordPP, { institution_id: 'ielusc', courses: ['PP'] }), true);
  assert.equal(coordinatesEvent(coordPP, { institution_id: 'ielusc', courses: [] }), true);
  assert.equal(coordinatesEvent(coordPP, { institution_id: 'ielusc', courses: ['JOR'] }), false);
  assert.equal(coordinatesEvent(coordPP, { institution_id: 'mackenzie', courses: ['PP'] }), false);
});

test('coordenador sem curso cobre a instituição toda; outros papéis não coordenam', () => {
  assert.equal(coordinatesEvent({ ...coordPP, course_id: null }, { institution_id: 'ielusc', courses: ['JOR'] }), true);
  assert.equal(coordinatesEvent({ ...coordPP, role: 'admin' }, { institution_id: 'ielusc', courses: ['PP'] }), false);
});

test('admin com instituição também é aluno', () => {
  assert.equal(isStudentLike({ role: 'admin', institution_id: 'ielusc' }), true);
  assert.equal(isStudentLike({ role: 'admin', institution_id: null }), false);
  assert.equal(isStudentLike({ role: 'student' }), true);
  assert.equal(isStudentLike({ role: 'secretaria', institution_id: 'ielusc' }), false);
});

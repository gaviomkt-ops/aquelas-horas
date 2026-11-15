import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, getCursoCatalogo, getInstituicao, matrizCobreAno, metaDoCatalogo, buscarCatalogo, alertasDoCurso } from '../data/acg/index.js';
import { goalFor, getInstitution, typeForEvent } from './rules.js';
import { computeProgress } from './progress.js';

test('meta em horas só vem de número confiável em horas', () => {
  assert.equal(metaDoCatalogo(getCursoCatalogo('univille', 'DIR')), 240); // 288 h/a = 240 h na matriz
  assert.equal(metaDoCatalogo(getCursoCatalogo('ielusc', 'ADM')), 120);
  assert.equal(metaDoCatalogo(getCursoCatalogo('udesc_cct', 'CIVIL-N')), null); // h/a sem equivalente em h
  assert.equal(metaDoCatalogo(getCursoCatalogo('ufsc_joinville', 'NAVAL-2025')), null); // pontos
  assert.equal(metaDoCatalogo(getCursoCatalogo('fgg', 'DIR-S')), null); // regulamento x matriz se contradizem
  assert.equal(metaDoCatalogo(getCursoCatalogo('ifsc_joinville', 'EELE')), null); // número histórico
  assert.equal(metaDoCatalogo(getCursoCatalogo('ifsc_joinville', 'GHOSP')), null); // lido só no buscador
  assert.equal(metaDoCatalogo(getCursoCatalogo('cnec_joinville', 'DIR')), null); // 180 x 300
  assert.equal(metaDoCatalogo(getCursoCatalogo('univille', 'PED')), null); // zero a confirmar
});

test('toda carga numérica tem fonte e unidade quando verificada', () => {
  for (const inst of CATALOGO) {
    for (const c of inst.cursos) {
      const h = c.horas;
      if (h.valor != null && h.valor > 0) assert.ok(h.fonte, `${inst.id}/${c.id} sem fonte`);
      if (h.situacao === 'verificado') assert.ok(h.unidade, `${inst.id}/${c.id} verificado sem unidade`);
      if (h.situacao !== 'verificado') assert.ok(c.a_confirmar?.length || h.nota || c.alertas?.length, `${inst.id}/${c.id} incerto sem explicação`);
    }
  }
});

test('as contradições da pesquisa continuam visíveis como alerta', () => {
  const dir = getCursoCatalogo('univille', 'DIR');
  assert.ok(alertasDoCurso(getInstituicao('univille'), dir).some((a) => a.nivel === 'alto' && a.texto.includes('288')));
  assert.equal(getCursoCatalogo('fgg', 'TO-S').horas.situacao, 'contraditorio');
  assert.equal(getCursoCatalogo('fgg', 'TO-S').horas.alternativa.valor, 96);
  assert.equal(getCursoCatalogo('fgg', 'DIR-S').horas.alternativa.valor, 340);
  assert.equal(getCursoCatalogo('cnec_joinville', 'DIR').horas.alternativa.valor, 300);
  assert.ok(getInstituicao('udesc_cct').alertas.some((a) => a.nivel === 'alto' && /duas resoluções/i.test(a.texto)));
  assert.ok(getInstituicao('ielusc').alertas.some((a) => a.nivel === 'alto' && /35\/2019/.test(a.texto)));
  assert.equal(getCursoCatalogo('univille', 'HIST').horas.situacao, 'contraditorio');
});

test('ano de ingresso filtra as matrizes com corte conhecido', () => {
  const novo = getCursoCatalogo('udesc_cct', 'PROD-N'); // a partir de 2024/2
  const antigo = getCursoCatalogo('udesc_cct', 'PROD-A'); // até 2024/1
  assert.equal(matrizCobreAno(novo, 2023), false);
  assert.equal(matrizCobreAno(novo, 2025), true);
  assert.equal(matrizCobreAno(antigo, 2025), false);
  assert.equal(matrizCobreAno(antigo, 2022), true);
  assert.equal(matrizCobreAno(getCursoCatalogo('univille', 'PSI'), 2021), false); // "a partir de 2022/1"
  assert.equal(matrizCobreAno(getCursoCatalogo('univille', 'ENF-2022'), 2024), false); // "até 2022"
  assert.equal(matrizCobreAno(getCursoCatalogo('ielusc', 'ADM'), 2019), true); // sem corte: não esconde
});

test('busca por instituição e curso', () => {
  assert.ok(buscarCatalogo({ texto: 'direito' }).length >= 5);
  assert.ok(buscarCatalogo({ texto: 'udesc' }).every((r) => r.inst.id === 'udesc_cct'));
  assert.equal(buscarCatalogo({ texto: 'engenharia civil', instituicaoId: 'univille' }).length, 1);
  assert.equal(buscarCatalogo({ texto: 'não existe isso' }).length, 0);
});

test('instituições do catálogo entram no cálculo de progresso sem inventar meta', () => {
  const uni = { institution_id: 'univille', course_id: 'DIR', role: 'student' };
  assert.equal(getInstitution('univille').catalog, true);
  assert.equal(goalFor(uni), 240);
  const semMeta = { institution_id: 'udesc_cct', course_id: 'CIVIL-N', goal_hours: 120, role: 'student' };
  assert.equal(goalFor(semMeta), 120); // o aluno digitou
  assert.equal(goalFor({ institution_id: 'udesc_cct', course_id: 'CIVIL-N', role: 'student' }), 0);
  const p = computeProgress(uni, [{ type_key: 'g_eventos', hours: 10, status: 'guardado', issued_on: '2026-01-01' }]);
  assert.equal(p.counted, 10);
  assert.equal(p.goal, 240);
  assert.equal(typeForEvent(uni, 'palestra'), 'g_eventos');
});

test('IELUSC continua com a tabela própria do app', () => {
  assert.equal(getInstitution('ielusc').catalog, undefined);
  assert.equal(goalFor({ institution_id: 'ielusc', course_id: 'PP' }), 200);
});

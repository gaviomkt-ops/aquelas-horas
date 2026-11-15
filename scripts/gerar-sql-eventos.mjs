// Gera supabase/eventos-iniciais.sql a partir dos eventos reais do seed (src/lib/seed.js),
// para o modo online ter exatamente a mesma vitrine do modo demonstração.
// Uso: node scripts/gerar-sql-eventos.mjs
import { writeFileSync } from 'node:fs';
import { REAL_EVENTS } from '../src/lib/seed.js';

const q = (v) => (v == null ? 'null' : `$t$${v}$t$`);
const n = (v) => (v == null ? 'null' : String(Number(v)));
const arr = (a) => (a && a.length ? `array[${a.map(q).join(', ')}]::text[]` : `'{}'::text[]`);

const blocks = REAL_EVENTS.map(
  (e) => `-- ${e.title}
insert into public.events (organizer_id, organizer_name, title, category, hours, starts_at, ends_at, location, address, city,
  price, link, capacity, requirements, description, courses, image_url, institution_id, status, boost_status, boost_until,
  cert_issuer, cert_signer_name, cert_signer_role, cert_participation, cert_delivery)
select p.id, ${q(e.organizer_name)}, ${q(e.title)}, ${q(e.category)}, ${n(e.hours)}, ${q(e.starts_at)}, ${q(e.ends_at)},
  ${q(e.location)}, ${q(e.address)}, ${q(e.city)}, ${n(e.price)}, ${q(e.link)}, ${n(e.capacity)}, ${arr(e.requirements)},
  ${q(e.description)}, ${arr(e.courses)}, ${q(e.image_url)}, ${q(e.institution_id)}, 'approved', ${q(e.boost_status)}, ${q(e.boost_until)},
  ${q(e.cert_issuer)}, ${q(e.cert_signer_name)}, ${q(e.cert_signer_role)}, ${q(e.cert_participation)}, ${q(e.cert_delivery)}
from public.profiles p
where p.role = 'admin'
  and not exists (select 1 from public.events x where x.title = ${q(e.title)} and x.starts_at = ${q(e.starts_at)}::timestamptz)
order by p.created_at
limit 1;
`,
);

const sql = `-- ============================================================================
-- Eventos iniciais da vitrine (gerado por scripts/gerar-sql-eventos.mjs; não edite à mão)
-- Rode DEPOIS do schema.sql e DEPOIS de promover sua conta a admin.
-- Os eventos ficam no nome do primeiro admin e já entram publicados.
-- Pode rodar de novo: evento com mesmo título e horário não é duplicado.
-- ============================================================================

${blocks.join('\n')}`;
writeFileSync(new URL('../supabase/eventos-iniciais.sql', import.meta.url), sql);
console.log(`eventos-iniciais.sql: ${REAL_EVENTS.length} eventos`);

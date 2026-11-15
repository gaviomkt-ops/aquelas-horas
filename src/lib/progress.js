import { typesFor, goalFor, getInstitution } from './rules.js';

// Calcula quanto de cada certificado conta de fato, respeitando:
// 1) o limite por item (ex.: 30h por trabalho apresentado),
// 2) o teto da categoria no curso,
// 3) a meta total do curso.
// Certificados recusados pela coordenação não contam.
export function computeProgress(profile, certificates) {
  const goal = goalFor(profile);
  const instId = profile?.institution_id || 'ielusc';
  const courseId = profile?.course_id;
  const types = typesFor(instId, courseId);
  const typeMap = Object.fromEntries(types.map((t) => [t.key, t]));
  const custom = !!getInstitution(instId).custom;

  const byType = {};
  for (const t of types) {
    byType[t.key] = { ...t, raw: 0, eligible: 0, counted: 0, excess: 0, validated: 0, items: [] };
  }
  const unknown = { key: '_outros', label: 'Fora da tabela do seu curso', max: 0, raw: 0, eligible: 0, counted: 0, excess: 0, validated: 0, items: [] };

  // ordena por data para que os mais antigos ocupem o teto primeiro
  const sorted = [...(certificates || [])].sort((a, b) => String(a.issued_on || a.created_at).localeCompare(String(b.issued_on || b.created_at)));

  for (const c of sorted) {
    const hours = Math.max(0, Number(c.hours) || 0);
    const bucket = byType[c.type_key] || unknown;
    const item = { ...c, hours, counted: 0, note: '' };
    bucket.items.push(item);
    if (c.status === 'recusado') {
      item.note = 'Recusado pela coordenação';
      continue;
    }
    bucket.raw += hours;
    if (bucket === unknown) {
      item.note = 'Esse tipo não está na tabela do seu curso';
      continue;
    }
    const t = typeMap[c.type_key];
    let eligible = hours;
    if (t.per && eligible > t.per) {
      eligible = t.per;
      item.note = `Limite de ${t.per}h por ${t.perUnit}`;
    }
    const room = custom || t.max == null ? Infinity : Math.max(0, t.max - bucket.counted);
    const counted = Math.min(eligible, room);
    if (counted < eligible) item.note = `Teto da categoria (${t.max}h) atingido`;
    item.counted = counted;
    bucket.eligible += eligible;
    bucket.counted += counted;
    bucket.excess += hours - counted;
    if (c.status === 'validado') bucket.validated += counted;
  }

  const list = Object.values(byType);
  if (unknown.items.length) list.push(unknown);
  const sumCounted = list.reduce((s, t) => s + t.counted, 0);
  const counted = goal ? Math.min(sumCounted, goal) : sumCounted;
  const validated = list.reduce((s, t) => s + t.validated, 0);
  const raw = list.reduce((s, t) => s + t.raw, 0);
  const remaining = goal ? Math.max(0, goal - counted) : 0;
  const pct = goal ? Math.min(100, Math.round((counted / goal) * 100)) : 0;

  return {
    goal,
    counted,
    validated: Math.min(validated, goal || validated),
    raw,
    lost: Math.max(0, raw - sumCounted),
    overGoal: goal ? Math.max(0, sumCounted - goal) : 0,
    remaining,
    pct,
    done: goal > 0 && counted >= goal,
    types: list,
    active: list.filter((t) => t.items.length > 0),
    certificates: sorted.length,
  };
}

// Quantas horas ainda cabem numa categoria (para dizer se um evento vale a pena).
export function roomInType(progress, typeKey) {
  const t = progress.types.find((x) => x.key === typeKey);
  if (!t) return 0;
  if (t.max == null) return Infinity;
  return Math.max(0, t.max - t.counted);
}

export function formatHours(h) {
  if (h === Infinity) return 'sem teto';
  const n = Math.round(Number(h) * 10) / 10;
  return `${String(n).replace('.', ',')}h`;
}

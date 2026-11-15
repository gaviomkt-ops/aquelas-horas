const TZ = 'America/Sao_Paulo';

const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: TZ });
const fullFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
const ymdFmt = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ });

export const ymd = (d) => ymdFmt.format(new Date(d));
export const todayYmd = () => ymd(new Date());

function addDays(ymdStr, n) {
  const [y, m, d] = ymdStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n, 12));
  return dt.toISOString().slice(0, 10);
}

export function dayLabel(iso) {
  const d = ymd(iso);
  const t = todayYmd();
  if (d === t) return 'Hoje';
  if (d === addDays(t, 1)) return 'Amanhã';
  return dayFmt.format(new Date(iso)).replace('.', '');
}

export function timeLabel(iso) {
  return timeFmt.format(new Date(iso));
}

export function weekday(iso) {
  return weekdayFmt.format(new Date(iso)).replace('.', '');
}

export function fullDate(iso) {
  const s = fullFmt.format(new Date(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// "Hoje", "Hoje até 15/11", "17 nov", "17 a 19 nov"
export function dateRangeLabel(ev) {
  const start = ev.starts_at;
  const end = ev.ends_at || ev.starts_at;
  const sd = ymd(start);
  const ed = ymd(end);
  const t = todayYmd();
  const short = (iso) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: TZ }).format(new Date(iso));
  if (sd === ed) return dayLabel(start);
  if (sd <= t && ed >= t) return `Hoje até ${short(end)}`;
  return `${dayLabel(start)} a ${short(end)}`;
}

// sem horário de término: considera que dura a carga horária (mínimo 1h) só para "Agora"/"encerrado"
function effectiveEnd(ev) {
  if (ev.ends_at) return new Date(ev.ends_at);
  return new Date(new Date(ev.starts_at).getTime() + Math.max(1, Number(ev.hours) || 1) * 3600000);
}

export function isLive(ev, now = new Date()) {
  const s = new Date(ev.starts_at);
  const e = effectiveEnd(ev);
  if (ymd(ev.starts_at) !== ymd(ev.ends_at || ev.starts_at)) {
    // evento de vários dias: "Agora" quando hoje está dentro do período
    const t = ymd(now);
    return ymd(s) <= t && ymd(e) >= t;
  }
  return now >= s && now <= e;
}

export function isPast(ev, now = new Date()) {
  return effectiveEnd(ev) < now;
}

export function isNew(ev, now = new Date()) {
  return ev.created_at && now - new Date(ev.created_at) < 1000 * 60 * 60 * 48;
}

export function isFree(ev) {
  return ev.price != null && ev.price !== '' && Number(ev.price) <= 0;
}

export function priceLabel(price) {
  if (price == null || price === '') return 'Valor a confirmar';
  const p = Number(price) || 0;
  if (p <= 0) return 'Gratuito';
  return p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: p % 1 ? 2 : 0 });
}

export function dateInputValue(iso) {
  if (!iso) return '';
  return ymd(iso);
}

export function timeInputValue(iso) {
  if (!iso) return '';
  return timeLabel(iso);
}

// junta data (AAAA-MM-DD) + hora (HH:MM) no fuso de Joinville (UTC-3, sem horário de verão)
export function toIso(date, time) {
  if (!date) return null;
  return new Date(`${date}T${time || '00:00'}:00-03:00`).toISOString();
}

export function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || '?'
  );
}

export function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

// Só aceita links http(s). Bloqueia javascript:, data: etc. (um link malicioso rodaria código no app).
export function safeUrl(u) {
  if (!u) return null;
  try {
    const x = new URL(String(u).trim());
    return /^https?:$/.test(x.protocol) ? x.href : null;
  } catch {
    return null;
  }
}

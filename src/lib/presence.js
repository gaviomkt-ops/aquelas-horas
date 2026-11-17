// Presença no evento (estilo "ponto móvel"): check-in pelo GPS, foto de evidência e saída.
// As mesmas regras valem no banco (supabase/migracao-2026-11-16-presenca.sql); aqui servem para
// montar as telas e para o modo demonstração.
import { toCsv } from './secretaria.js';

export const DEFAULT_RADIUS_M = 200;
export const MAX_ACCURACY_M = 1000; // GPS pior que isso não serve como prova
const WINDOW_MS = 30 * 60 * 1000; // check-in abre 30 min antes e fecha 30 min depois do fim

export function hasGeo(ev) {
  return ev?.geo_lat != null && ev?.geo_lng != null && Number.isFinite(Number(ev.geo_lat)) && Number.isFinite(Number(ev.geo_lng));
}

// distância em metros entre dois pontos (fórmula de haversine, igual à do banco)
export function distanceM(lat1, lng1, lat2, lng2) {
  const rad = (x) => (Number(x) * Math.PI) / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(a));
}

export function checkinWindow(ev) {
  const start = new Date(ev.starts_at).getTime();
  const end = ev.ends_at ? new Date(ev.ends_at).getTime() : start + Math.max(1, Number(ev.hours) || 1) * 3600000;
  return { opens: new Date(start - WINDOW_MS), closes: new Date(end + WINDOW_MS) };
}

export function windowState(ev, now = new Date()) {
  const { opens, closes } = checkinWindow(ev);
  if (now < opens) return 'antes';
  if (now > closes) return 'encerrado';
  return 'aberto';
}

// dentro da área do evento: raio + a margem de erro do GPS (até 100 m)
export function isInside(ev, distance, accuracy) {
  const raio = Number(ev.geo_radius_m) || DEFAULT_RADIUS_M;
  return distance <= raio + Math.min(Math.max(Number(accuracy) || 0, 0), 100);
}

export function positionCheck(ev, pos) {
  const distance = Math.round(distanceM(ev.geo_lat, ev.geo_lng, pos.lat, pos.lng));
  return { distance, accuracy: Math.round(pos.accuracy || 0), inside: isInside(ev, distance, pos.accuracy) };
}

// tempo no evento: da entrada até a saída registrada ou o último sinal do app no local
export function permanenceMinutes(att) {
  if (!att?.checkin_at) return 0;
  const fim = [att.checkout_at, att.last_seen_at].filter(Boolean).map((d) => new Date(d).getTime());
  if (!fim.length) return 0;
  return Math.max(0, Math.round((Math.max(...fim) - new Date(att.checkin_at).getTime()) / 60000));
}

export function durationLabel(min) {
  if (!min) return '0 min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}

// situação da presença para mostrar ao aluno, à organização e à secretaria
export function presenceStatus(att) {
  if (!att) return { key: 'sem', label: 'Sem presença registrada', tone: 'neutral' };
  if (!att.photo_path) return { key: 'parcial', label: 'Check-in feito · falta a foto', tone: 'warn' };
  return { key: 'completa', label: 'Presença comprovada', tone: 'ok' };
}

const hora = (d) => (d ? new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }) : '');
const dia = (d) => (d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '');
export { hora as horaLabel };

// planilha da lista de presença (abre no Excel e no Google Planilhas)
export function csvPresenca(rows) {
  return toCsv(
    ['Nome', 'E-mail', 'Curso', 'Data', 'Entrada', 'Saída/último sinal', 'Permanência (min)', 'Distância na entrada (m)', 'Precisão do GPS (m)', 'Check-in', 'Foto', 'Comprovante'],
    rows.map((r) => [
      r.name || '',
      r.email || '',
      r.course_id || '',
      dia(r.checkin_at),
      hora(r.checkin_at),
      hora(r.checkout_at || r.last_seen_at),
      permanenceMinutes(r),
      r.checkin_distance_m ?? '',
      r.checkin_accuracy_m ?? '',
      r.checkin_auto ? 'automático' : 'manual',
      r.photo_path ? 'sim' : 'não',
      r.receipt_code || '',
    ]),
  );
}

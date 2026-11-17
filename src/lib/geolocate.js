// Localização do celular (só no navegador). A posição é comparada com o local do evento aqui
// no aparelho; ela só vai para o servidor quando a pessoa está no evento, e o banco guarda apenas
// a distância e a precisão, nunca as coordenadas do aluno.
import { MAX_ACCURACY_M } from './presence.js';

export function geoSupported() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

// 'granted' | 'prompt' | 'denied' | 'unknown' (Safari antigo não informa)
export async function geoPermission() {
  try {
    if (!navigator.permissions?.query) return 'unknown';
    const st = await navigator.permissions.query({ name: 'geolocation' });
    return st.state;
  } catch {
    return 'unknown';
  }
}

export function getPosition({ timeout = 20000, maximumAge = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!geoSupported()) return reject(new Error('Este navegador não informa a localização.'));
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy };
        if (pos.accuracy > MAX_ACCURACY_M) reject(new Error(`O GPS está impreciso (± ${Math.round(pos.accuracy)} m). Ative a localização precisa e tente de novo.`));
        else resolve(pos);
      },
      (err) => {
        if (err.code === 1) reject(new Error('Libere a localização para o Àquelas Horas nas configurações do navegador para registrar presença.'));
        else if (err.code === 3) reject(new Error('O GPS demorou para responder. Vá para um lugar aberto ou perto de uma janela e tente de novo.'));
        else reject(new Error('Não foi possível pegar sua localização agora. Tente de novo.'));
      },
      { enableHighAccuracy: true, timeout, maximumAge },
    );
  });
}

// endereço → coordenadas (OpenStreetMap). Usado só por quem cadastra o evento; vai o endereço, não dados pessoais.
export async function geocode(query) {
  const q = String(query || '').trim();
  if (q.length < 6) throw new Error('Escreva o endereço com rua, número e cidade.');
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&accept-language=pt-BR&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('A busca de endereço não respondeu. Tente "Usar minha localização" no local do evento.');
  const [hit] = await res.json();
  if (!hit) throw new Error('Endereço não encontrado. Confira o texto ou use "Usar minha localização" no local do evento.');
  return { lat: Number(hit.lat), lng: Number(hit.lon), label: hit.display_name };
}

export function mapLink(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

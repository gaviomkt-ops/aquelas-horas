// Instalação do app pelo navegador (PWA).
// Android/Chrome dispara "beforeinstallprompt": guardamos o evento para abrir o pedido de
// instalação quando a pessoa tocar no botão. iPhone não tem esse evento: mostramos o passo a passo.
let deferred = null;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    emit();
  });
}

export function onInstallChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function canPrompt() {
  return !!deferred;
}

export async function promptInstall() {
  if (!deferred) return false;
  deferred.prompt();
  const choice = await deferred.userChoice.catch(() => null);
  deferred = null;
  emit();
  return choice?.outcome === 'accepted';
}

export function isInstalled() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function platform() {
  const ua = navigator.userAgent || '';
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  // navegadores dentro de apps (Instagram, Facebook, WhatsApp, TikTok…) não instalam
  const inApp = /Instagram|FBAN|FBAV|FB_IAB|Line\/|WhatsApp|TikTok|musical_ly|LinkedInApp|Snapchat/i.test(ua);
  const android = /Android/i.test(ua);
  const iosSafari = ios && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua) && !inApp;
  return { ios, android, inApp, iosSafari };
}

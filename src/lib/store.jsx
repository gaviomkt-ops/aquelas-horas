import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './backend/index.js';
import { computeProgress } from './progress.js';
import { isStudentLike } from './roles.js';
import { getPosition } from './geolocate.js';
import { compressImage } from './image.js';

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = carregando
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [attendance, setAttendance] = useState([]); // minhas presenças (check-in pelo GPS)
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  // redefinição de senha: null ou { email, tokenHash, error, verified }
  const [recovery, setRecovery] = useState(recoveryFromUrl);

  const notify = useCallback((message, tone = 'ok') => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const [ev, ct] = await Promise.all([api.listPublicEvents(), api.eventCounts()]);
      setEvents(ev || []);
      setCounts(ct || {});
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [notify]);

  const loadMine = useCallback(async (u) => {
    if (!u) {
      setProfile(null);
      setInteractions([]);
      setCertificates([]);
      setAttendance([]);
      return;
    }
    try {
      const p = await api.getMyProfile();
      setProfile(p);
      const aluno = isStudentLike(p);
      const [inter, certs, att] = await Promise.all([
        api.myInteractions(),
        aluno ? api.listCertificates() : Promise.resolve([]),
        aluno ? api.myAttendance().catch(() => []) : Promise.resolve([]),
      ]);
      setInteractions(inter || []);
      setCertificates(certs || []);
      setAttendance(att || []);
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [notify]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const u = await api.getUser();
      if (!alive) return;
      setUser(u);
      cleanAuthParams(); // o Supabase já leu a URL; tira código/erro da barra de endereço
      await Promise.all([loadMine(u), loadEvents()]);
      if (alive) setLoading(false);
    })();
    const off = api.onAuthChange(async (u, evt) => {
      if (evt === 'PASSWORD_RECOVERY') setRecovery((prev) => ({ ...(prev || {}), verified: true }));
      setUser((prev) => (prev?.id === u?.id ? prev : u));
      await loadMine(u);
    });
    return () => {
      alive = false;
      off?.();
    };
  }, [loadEvents, loadMine]);

  const refreshProfile = useCallback(async () => {
    const p = await api.getMyProfile();
    setProfile(p);
    if (isStudentLike(p)) setCertificates(await api.listCertificates());
    return p;
  }, []);

  const refreshCertificates = useCallback(async () => {
    setCertificates(await api.listCertificates());
  }, []);

  const toggle = useCallback(
    async (eventId, kind) => {
      if (!user) {
        notify('Entre na sua conta para marcar eventos.', 'error');
        return false;
      }
      const on = !interactions.some((i) => i.event_id === eventId && i.kind === kind);
      // atualização otimista
      setInteractions((prev) => (on ? [...prev, { user_id: user.id, event_id: eventId, kind }] : prev.filter((i) => !(i.event_id === eventId && i.kind === kind))));
      setCounts((prev) => {
        const c = { going: 0, saved: 0, ...(prev[eventId] || {}) };
        c[kind] = Math.max(0, c[kind] + (on ? 1 : -1));
        return { ...prev, [eventId]: c };
      });
      try {
        await api.setInteraction(eventId, kind, on);
      } catch (e) {
        notify(e.message, 'error');
        setInteractions(await api.myInteractions());
      }
      return on;
    },
    [user, interactions, notify],
  );

  // presença: check-in/sinal/saída pelo GPS e foto de evidência
  const keepAttendance = useCallback((row) => {
    if (row?.event_id) setAttendance((prev) => [...prev.filter((a) => a.event_id !== row.event_id), row]);
    return row;
  }, []);
  const checkIn = useCallback(
    async (ev, mode = 'manual', pos = null) => keepAttendance(await api.attendancePing(ev.id, pos || (await getPosition()), mode)),
    [keepAttendance],
  );
  const sendPresencePhoto = useCallback(
    async (ev, file) => {
      if (!file?.type?.startsWith('image/')) throw new Error('Envie uma foto (JPG ou PNG).');
      const small = await compressImage(file, 1280, 0.72);
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(small.type)) throw new Error('Formato de foto não aceito. Tire a foto com a câmera do app.');
      return keepAttendance(await api.uploadAttendancePhoto(ev.id, small));
    },
    [keepAttendance],
  );
  const attendanceFor = useCallback((eventId) => attendance.find((a) => a.event_id === eventId) || null, [attendance]);

  const has = useCallback((eventId, kind) => interactions.some((i) => i.event_id === eventId && i.kind === kind), [interactions]);

  const progress = useMemo(() => (isStudentLike(profile) ? computeProgress(profile, certificates) : null), [profile, certificates]);

  const value = {
    api,
    user,
    profile,
    events,
    counts,
    interactions,
    certificates,
    attendance,
    attendanceFor,
    checkIn,
    sendPresencePhoto,
    progress,
    loading,
    toast,
    recovery,
    setRecovery,
    setToast,
    notify,
    loadEvents,
    refreshProfile,
    refreshCertificates,
    toggle,
    has,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  return useContext(Ctx);
}

// Lê da URL o que o e-mail de "esqueci a senha" manda:
// - ?token_hash=…&type=recovery (botão do e-mail novo) → tela de nova senha;
// - ?error_code=otp_expired… (link vencido ou já usado) → tela de redefinir com o aviso.
function authParams() {
  const out = new URLSearchParams(window.location.search);
  // no fluxo antigo o erro pode vir depois do # (ex.: #error=access_denied&error_code=…)
  const h = window.location.hash.replace(/^#\/?/, '');
  if (/(^|&)(error|error_code|error_description)=/.test(h)) for (const [k, v] of new URLSearchParams(h)) if (!out.has(k)) out.set(k, v);
  return out;
}
function recoveryFromUrl() {
  if (typeof window === 'undefined') return null;
  const q = authParams();
  if (q.get('token_hash') && q.get('type') === 'recovery') return { tokenHash: q.get('token_hash') };
  const code = q.get('error_code') || q.get('error');
  if (code) {
    const expired = /expired|invalid/i.test(`${code} ${q.get('error_description') || ''}`);
    return {
      error: expired
        ? 'Esse link do e-mail venceu ou já foi usado (alguns e-mails "abrem" o link sozinhos para checar vírus). Peça um código novo abaixo: é mais garantido.'
        : 'Não deu para abrir o link do e-mail. Peça um código novo abaixo.',
    };
  }
  return null;
}
function cleanAuthParams() {
  const q = authParams();
  const keys = ['token_hash', 'type', 'error', 'error_code', 'error_description', 'code'];
  if (!keys.some((k) => q.has(k))) return;
  const route = /(^|&)(error|error_code|error_description|access_token)=/.test(window.location.hash.replace(/^#\/?/, '')) ? '#/' : window.location.hash || '#/';
  window.history.replaceState(null, '', window.location.pathname + route);
}

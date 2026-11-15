// MODO DEMONSTRAÇÃO: tudo fica no navegador (localStorage + IndexedDB para arquivos).
// Serve para testar o app sem servidor. Os dados não passam de um aparelho para outro.
import { demoSeed, REAL_EVENTS, SEED_VERSION } from '../seed.js';

const KEY = 'ah_demo_db_v1';
const SESSION = 'ah_demo_session_v1';
const listeners = new Set();

function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
const now = () => new Date().toISOString();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const db = JSON.parse(raw);
      if ((db.seedVersion || 1) < SEED_VERSION) {
        // banco demo antigo: tira os eventos genéricos de exemplo e atualiza os reais
        const realIds = new Set(REAL_EVENTS.map((e) => e.id));
        // remove exemplos e eventos de teste da conta organizadora demo
        const exampleIds = new Set(
          db.events.filter((e) => e.is_example || String(e.id).startsWith('ex-') || (e.organizer_id === 'demo-org' && !realIds.has(e.id))).map((e) => e.id),
        );
        db.events = db.events.filter((e) => !exampleIds.has(e.id));
        db.interactions = db.interactions.filter((i) => !exampleIds.has(i.event_id));
        for (const ev of REAL_EVENTS) {
          const i = db.events.findIndex((e) => e.id === ev.id);
          const fresh = { ...ev, organizer_id: 'demo-org' };
          if (i === -1) db.events.unshift(fresh);
          else db.events[i] = { ...fresh, views: db.events[i].views, link_clicks: db.events[i].link_clicks };
        }
        db.seedVersion = SEED_VERSION;
        save(db);
      }
      return db;
    }
  } catch {
    /* ignora */
  }
  const db = demoSeed();
  save(db);
  return db;
}
function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch (e) {
    throw new Error('O navegador ficou sem espaço para o modo demonstração. Apague alguns certificados.');
  }
}
function currentUserId() {
  try {
    return localStorage.getItem(SESSION);
  } catch {
    return null;
  }
}
function requireUser() {
  const id = currentUserId();
  if (!id) throw new Error('Faça login para continuar.');
  return id;
}
function myProfile(db) {
  const id = currentUserId();
  return db.profiles.find((p) => p.id === id) || null;
}
function requireAdmin(db) {
  const p = myProfile(db);
  if (p?.role !== 'admin') throw new Error('Apenas administradores.');
  return p;
}
function emit() {
  const u = getUserSync();
  listeners.forEach((cb) => cb(u));
}
function getUserSync() {
  const id = currentUserId();
  if (!id) return null;
  const db = load();
  const u = db.users.find((x) => x.id === id);
  return u ? { id: u.id, email: u.email } : null;
}

// ---------- arquivos (IndexedDB) ----------
function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ah_demo_files', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('files');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function putFile(path, blob) {
  const db = await idb();
  await new Promise((res, rej) => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').put(blob, path);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}
async function getFile(path) {
  const db = await idb();
  return new Promise((res, rej) => {
    const tx = db.transaction('files', 'readonly');
    const r = tx.objectStore('files').get(path);
    r.onsuccess = () => res(r.result || null);
    r.onerror = () => rej(r.error);
  });
}
async function delFile(path) {
  const db = await idb();
  await new Promise((res) => {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').delete(path);
    tx.oncomplete = res;
    tx.onerror = res;
  });
}
function blobToDataUrl(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
}

// "hash" simples só para não guardar a senha em texto puro no modo demo.
async function hash(text) {
  const data = new TextEncoder().encode(`ah:${text}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const STUDENT_FIELDS = ['name', 'institution_id', 'institution_type', 'institution_name', 'course_id', 'semester', 'goal_hours', 'onboarded', 'role', 'org_name', 'org_instagram', 'org_bio', 'accepted_terms_at', 'password_set'];
const EVENT_FIELDS = ['title', 'description', 'category', 'hours', 'starts_at', 'ends_at', 'location', 'address', 'city', 'price', 'link', 'image_url', 'courses', 'institution_id', 'boost_status', 'capacity', 'requirements', 'cert_issuer', 'cert_signer_name', 'cert_signer_role', 'cert_participation', 'cert_delivery'];

export const local = {
  mode: 'demo',

  // ---------- auth ----------
  async getUser() {
    return getUserSync();
  },
  onAuthChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  async signUp({ email, password, name }) {
    const db = load();
    const e = String(email).trim().toLowerCase();
    if (db.users.some((u) => u.email === e)) throw new Error('Já existe uma conta com esse e-mail.');
    if (String(password).length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres, com letras e números.');
    const id = uid();
    db.users.push({ id, email: e, password: await hash(password) });
    db.profiles.push({ id, email: e, name: name || e.split('@')[0], role: 'student', onboarded: false, password_set: false, created_at: now() });
    save(db);
    localStorage.setItem(SESSION, id);
    emit();
    return { id, email: e };
  },
  async signIn({ email, password }) {
    const db = load();
    const e = String(email).trim().toLowerCase();
    const u = db.users.find((x) => x.email === e);
    const ok = u && (u.seedPassword ? u.seedPassword === password : u.password === (await hash(password)));
    if (!ok) throw new Error('E-mail ou senha incorretos.');
    localStorage.setItem(SESSION, u.id);
    emit();
    return { id: u.id, email: u.email };
  },
  async signOut() {
    localStorage.removeItem(SESSION);
    emit();
  },
  async updatePassword(password) {
    const id = requireUser();
    const db = load();
    const u = db.users.find((x) => x.id === id);
    u.password = await hash(password);
    delete u.seedPassword;
    save(db);
  },
  async resetPassword() {
    throw new Error('No modo demonstração não há envio de e-mail. Crie outra conta de teste.');
  },
  async deleteMyAccount() {
    const id = requireUser();
    const db = load();
    for (const c of db.certificates.filter((c) => c.user_id === id)) if (c.file_path) await delFile(c.file_path);
    db.certificates = db.certificates.filter((c) => c.user_id !== id);
    db.interactions = db.interactions.filter((i) => i.user_id !== id);
    db.events = db.events.filter((e) => e.organizer_id !== id);
    db.profiles = db.profiles.filter((p) => p.id !== id);
    db.users = db.users.filter((u) => u.id !== id);
    save(db);
    localStorage.removeItem(SESSION);
    emit();
  },

  // ---------- perfis ----------
  async getMyProfile() {
    const id = currentUserId();
    if (!id) return null;
    return load().profiles.find((p) => p.id === id) || null;
  },
  async saveMyProfile(patch) {
    const id = requireUser();
    const db = load();
    const p = db.profiles.find((x) => x.id === id);
    const clean = {};
    for (const k of STUDENT_FIELDS) if (k in patch) clean[k] = patch[k];
    if (clean.role === 'admin' && p.role !== 'admin') delete clean.role;
    if (clean.role === 'organizer' && p.role !== 'organizer') clean.org_status = 'pending';
    if (clean.role === 'student') clean.org_status = null;
    Object.assign(p, clean, { updated_at: now() });
    save(db);
    return p;
  },
  async listProfiles(filter = {}) {
    const db = load();
    requireAdmin(db);
    return db.profiles
      .filter((p) => (filter.role ? p.role === filter.role : true))
      .filter((p) => (filter.org_status ? p.org_status === filter.org_status : true))
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  },
  async adminUpdateProfile(id, patch) {
    const db = load();
    requireAdmin(db);
    const p = db.profiles.find((x) => x.id === id);
    Object.assign(p, patch, { updated_at: now() });
    save(db);
    return p;
  },

  // ---------- eventos ----------
  async listPublicEvents() {
    return load().events.filter((e) => e.status === 'approved');
  },
  async getEvent(id) {
    const db = load();
    const e = db.events.find((x) => x.id === id);
    if (!e) return null;
    const me = myProfile(db);
    if (e.status === 'approved' || e.organizer_id === me?.id || me?.role === 'admin') return e;
    return null;
  },
  async listMyEvents() {
    const id = requireUser();
    return load()
      .events.filter((e) => e.organizer_id === id)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  },
  async listAllEvents() {
    const db = load();
    requireAdmin(db);
    return [...db.events].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  },
  async createEvent(data) {
    const db = load();
    const me = myProfile(db);
    if (!me) throw new Error('Faça login para continuar.');
    const isAdmin = me.role === 'admin';
    if (!isAdmin && !(me.role === 'organizer' && me.org_status === 'approved')) throw new Error('Seu perfil de organizador ainda não foi aprovado.');
    const ev = { id: uid(), organizer_id: me.id, organizer_name: me.org_name || me.name, status: isAdmin ? 'approved' : 'pending', boost_status: 'none', boost_until: null, views: 0, link_clicks: 0, created_at: now(), updated_at: now() };
    for (const k of EVENT_FIELDS) if (k in data) ev[k] = data[k];
    if (!isAdmin && !['none', 'requested'].includes(ev.boost_status)) ev.boost_status = 'none';
    db.events.push(ev);
    save(db);
    return ev;
  },
  async updateEvent(id, patch) {
    const db = load();
    const me = myProfile(db);
    const ev = db.events.find((x) => x.id === id);
    if (!ev || (ev.organizer_id !== me?.id && me?.role !== 'admin')) throw new Error('Evento não encontrado.');
    const isAdmin = me.role === 'admin';
    let contentChanged = false;
    for (const k of EVENT_FIELDS) {
      if (k in patch) {
        if (k !== 'boost_status' && JSON.stringify(ev[k]) !== JSON.stringify(patch[k])) contentChanged = true;
        ev[k] = patch[k];
      }
    }
    if (!isAdmin) {
      if (!['none', 'requested', 'active'].includes(ev.boost_status)) ev.boost_status = 'none';
      if (patch.boost_status === 'active') ev.boost_status = 'requested';
      if (contentChanged) ev.status = 'pending';
    }
    ev.updated_at = now();
    save(db);
    return ev;
  },
  async adminUpdateEvent(id, patch) {
    const db = load();
    requireAdmin(db);
    const ev = db.events.find((x) => x.id === id);
    Object.assign(ev, patch, { updated_at: now() });
    save(db);
    return ev;
  },
  async deleteEvent(id) {
    const db = load();
    const me = myProfile(db);
    const ev = db.events.find((x) => x.id === id);
    if (!ev || (ev.organizer_id !== me?.id && me?.role !== 'admin')) throw new Error('Evento não encontrado.');
    db.events = db.events.filter((x) => x.id !== id);
    db.interactions = db.interactions.filter((i) => i.event_id !== id);
    save(db);
  },
  async track(id, kind) {
    const db = load();
    const ev = db.events.find((x) => x.id === id);
    if (!ev) return;
    if (kind === 'view') ev.views = (ev.views || 0) + 1;
    if (kind === 'click') ev.link_clicks = (ev.link_clicks || 0) + 1;
    save(db);
  },
  async eventCounts() {
    const map = {};
    for (const i of load().interactions) {
      map[i.event_id] = map[i.event_id] || { going: 0, saved: 0 };
      map[i.event_id][i.kind] += 1;
    }
    return map;
  },
  async uploadEventImage(blob) {
    // no modo demo a imagem vira data URL (fica dentro do próprio evento)
    return blobToDataUrl(blob);
  },

  // ---------- interações ----------
  async myInteractions() {
    const id = currentUserId();
    if (!id) return [];
    return load().interactions.filter((i) => i.user_id === id);
  },
  async setInteraction(eventId, kind, on) {
    const id = requireUser();
    const db = load();
    db.interactions = db.interactions.filter((i) => !(i.user_id === id && i.event_id === eventId && i.kind === kind));
    if (on) db.interactions.push({ user_id: id, event_id: eventId, kind, created_at: now() });
    save(db);
  },

  // ---------- certificados ----------
  async listCertificates() {
    const id = requireUser();
    return load()
      .certificates.filter((c) => c.user_id === id)
      .sort((a, b) => String(b.issued_on || b.created_at).localeCompare(String(a.issued_on || a.created_at)));
  },
  async createCertificate(data, file) {
    const id = requireUser();
    const db = load();
    const cert = { id: uid(), user_id: id, status: 'guardado', created_at: now(), ...pickCert(data) };
    if (file) {
      const path = `${id}/${cert.id}`;
      await putFile(path, file);
      Object.assign(cert, { file_path: path, file_name: file.name || 'certificado', file_mime: file.type || '' });
    }
    db.certificates.push(cert);
    save(db);
    return cert;
  },
  async updateCertificate(certId, patch, file) {
    const id = requireUser();
    const db = load();
    const cert = db.certificates.find((c) => c.id === certId && c.user_id === id);
    if (!cert) throw new Error('Certificado não encontrado.');
    Object.assign(cert, pickCert(patch), { updated_at: now() });
    if (file) {
      const path = `${id}/${cert.id}`;
      await putFile(path, file);
      Object.assign(cert, { file_path: path, file_name: file.name || 'certificado', file_mime: file.type || '' });
    }
    save(db);
    return cert;
  },
  async deleteCertificate(certId) {
    const id = requireUser();
    const db = load();
    const cert = db.certificates.find((c) => c.id === certId && c.user_id === id);
    if (cert?.file_path) await delFile(cert.file_path);
    db.certificates = db.certificates.filter((c) => c !== cert);
    save(db);
  },
  async fileUrl(path) {
    const blob = await getFile(path);
    return blob ? URL.createObjectURL(blob) : null;
  },

  // ---------- admin ----------
  async stats() {
    const db = load();
    requireAdmin(db);
    return {
      students: db.profiles.filter((p) => p.role === 'student').length,
      organizers: db.profiles.filter((p) => p.role === 'organizer').length,
      events: db.events.length,
      approved_events: db.events.filter((e) => e.status === 'approved').length,
      certificates: db.certificates.length,
      hours: db.certificates.reduce((s, c) => s + (Number(c.hours) || 0), 0),
      going: db.interactions.filter((i) => i.kind === 'going').length,
      signups_today: db.profiles.filter((p) => String(p.created_at).slice(0, 10) === now().slice(0, 10)).length,
    };
  },

  // só no demo: volta ao estado inicial
  async resetDemo() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(SESSION);
    indexedDB.deleteDatabase('ah_demo_files');
    emit();
  },
};

function pickCert(d) {
  const out = {};
  for (const k of ['title', 'type_key', 'hours', 'issued_on', 'issuer', 'status', 'event_id', 'notes', 'missing_requirements', 'semesters']) if (k in d) out[k] = d[k];
  if ('hours' in out) out.hours = Number(out.hours) || 0;
  return out;
}

// MODO ONLINE: Supabase (Auth + Postgres + Storage). As regras de segurança ficam no
// banco (supabase/schema.sql): cada aluno só vê os próprios certificados, organizador só
// edita os próprios eventos e só o admin aprova.
import { createClient } from '@supabase/supabase-js';

export function makeSupabaseBackend(url, anonKey) {
  const sb = createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } });
  // pkce: o link de e-mail volta com ?code=, sem brigar com as rotas em #

  const ok = ({ data, error }) => {
    if (error) throw new Error(translate(error.message));
    return data;
  };
  async function uidOrThrow() {
    const { data } = await sb.auth.getUser();
    if (!data?.user) throw new Error('Faça login para continuar.');
    return data.user.id;
  }

  return {
    mode: 'online',

    // ---------- auth ----------
    async getUser() {
      const { data } = await sb.auth.getSession();
      const u = data?.session?.user;
      return u ? { id: u.id, email: u.email } : null;
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((evt, session) => {
        const u = session?.user;
        cb(u ? { id: u.id, email: u.email } : null, evt);
      });
      return () => data.subscription.unsubscribe();
    },
    async signUp({ email, password, name }) {
      const data = ok(
        await sb.auth.signUp({
          email: String(email).trim().toLowerCase(),
          password,
          options: { data: { name }, emailRedirectTo: window.location.origin + window.location.pathname },
        }),
      );
      if (!data.session) {
        // projeto com confirmação de e-mail ligada
        throw new Error('Conta criada! Confirme pelo link que enviamos ao seu e-mail e depois entre.');
      }
      return { id: data.user.id, email: data.user.email };
    },
    async signIn({ email, password }) {
      const data = ok(await sb.auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password }));
      return { id: data.user.id, email: data.user.email };
    },
    async signOut() {
      await sb.auth.signOut();
    },
    async updatePassword(password) {
      ok(await sb.auth.updateUser({ password }));
    },
    async resetPassword(email) {
      ok(await sb.auth.resetPasswordForEmail(String(email).trim().toLowerCase(), { redirectTo: window.location.origin + window.location.pathname }));
    },
    async deleteMyAccount() {
      const id = await uidOrThrow();
      const certs = ok(await sb.from('certificates').select('file_path').eq('user_id', id));
      const paths = certs.map((c) => c.file_path).filter(Boolean);
      if (paths.length) await sb.storage.from('certificates').remove(paths);
      ok(await sb.rpc('delete_my_account'));
      await sb.auth.signOut();
    },

    // ---------- perfis ----------
    async getMyProfile() {
      const { data: s } = await sb.auth.getSession();
      if (!s?.session) return null;
      return ok(await sb.from('profiles').select('*').eq('id', s.session.user.id).maybeSingle());
    },
    async saveMyProfile(patch) {
      const id = await uidOrThrow();
      const allowed = ['name', 'institution_id', 'course_id', 'semester', 'goal_hours', 'onboarded', 'role', 'org_name', 'org_instagram', 'org_bio', 'accepted_terms_at'];
      const clean = {};
      for (const k of allowed) if (k in patch) clean[k] = patch[k];
      return ok(await sb.from('profiles').update(clean).eq('id', id).select().single());
    },
    async listProfiles(filter = {}) {
      let q = sb.from('profiles').select('*').order('created_at', { ascending: false });
      if (filter.role) q = q.eq('role', filter.role);
      if (filter.org_status) q = q.eq('org_status', filter.org_status);
      return ok(await q);
    },
    async adminUpdateProfile(id, patch) {
      return ok(await sb.from('profiles').update(patch).eq('id', id).select().single());
    },

    // ---------- eventos ----------
    async listPublicEvents() {
      return ok(await sb.from('events').select('*').eq('status', 'approved').order('starts_at', { ascending: true }));
    },
    async getEvent(id) {
      return ok(await sb.from('events').select('*').eq('id', id).maybeSingle());
    },
    async listMyEvents() {
      const id = await uidOrThrow();
      return ok(await sb.from('events').select('*').eq('organizer_id', id).order('created_at', { ascending: false }));
    },
    async listAllEvents() {
      return ok(await sb.from('events').select('*').order('created_at', { ascending: false }));
    },
    async createEvent(data) {
      return ok(await sb.from('events').insert(data).select().single());
    },
    async updateEvent(id, patch) {
      return ok(await sb.from('events').update(patch).eq('id', id).select().single());
    },
    async adminUpdateEvent(id, patch) {
      return ok(await sb.from('events').update(patch).eq('id', id).select().single());
    },
    async deleteEvent(id) {
      ok(await sb.from('events').delete().eq('id', id));
    },
    async track(id, kind) {
      await sb.rpc('track_event', { p_event: id, p_kind: kind });
    },
    async eventCounts() {
      const rows = ok(await sb.rpc('event_counts'));
      const map = {};
      for (const r of rows || []) map[r.event_id] = { going: Number(r.going) || 0, saved: Number(r.saved) || 0 };
      return map;
    },
    async uploadEventImage(blob) {
      const id = await uidOrThrow();
      const path = `${id}/${Date.now()}.jpg`;
      ok(await sb.storage.from('event-images').upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false }));
      return sb.storage.from('event-images').getPublicUrl(path).data.publicUrl;
    },

    // ---------- interações ----------
    async myInteractions() {
      const { data: s } = await sb.auth.getSession();
      if (!s?.session) return [];
      return ok(await sb.from('interactions').select('*').eq('user_id', s.session.user.id));
    },
    async setInteraction(eventId, kind, on) {
      const id = await uidOrThrow();
      if (on) ok(await sb.from('interactions').upsert({ user_id: id, event_id: eventId, kind }, { onConflict: 'user_id,event_id,kind' }));
      else ok(await sb.from('interactions').delete().match({ user_id: id, event_id: eventId, kind }));
    },

    // ---------- certificados ----------
    async listCertificates() {
      const id = await uidOrThrow();
      return ok(await sb.from('certificates').select('*').eq('user_id', id).order('issued_on', { ascending: false, nullsFirst: false }));
    },
    async createCertificate(data, file) {
      const id = await uidOrThrow();
      const row = { ...pickCert(data), user_id: id };
      const cert = ok(await sb.from('certificates').insert(row).select().single());
      if (file) return attachFile(cert, file, id);
      return cert;
    },
    async updateCertificate(certId, patch, file) {
      const id = await uidOrThrow();
      const cert = ok(await sb.from('certificates').update(pickCert(patch)).eq('id', certId).select().single());
      if (file) return attachFile(cert, file, id);
      return cert;
    },
    async deleteCertificate(certId) {
      const cert = ok(await sb.from('certificates').select('file_path').eq('id', certId).maybeSingle());
      if (cert?.file_path) await sb.storage.from('certificates').remove([cert.file_path]);
      ok(await sb.from('certificates').delete().eq('id', certId));
    },
    async fileUrl(path) {
      const data = ok(await sb.storage.from('certificates').createSignedUrl(path, 60 * 10));
      return data.signedUrl;
    },

    // ---------- admin ----------
    async stats() {
      const rows = ok(await sb.rpc('admin_stats'));
      return Array.isArray(rows) ? rows[0] : rows;
    },
  };

  async function attachFile(cert, file, uid) {
    const ext = (file.name || '').split('.').pop()?.toLowerCase() || (file.type === 'application/pdf' ? 'pdf' : 'jpg');
    const path = `${uid}/${cert.id}.${ext}`;
    ok(await sb.storage.from('certificates').upload(path, file, { contentType: file.type || undefined, upsert: true }));
    return ok(
      await sb
        .from('certificates')
        .update({ file_path: path, file_name: file.name || 'certificado', file_mime: file.type || '' })
        .eq('id', cert.id)
        .select()
        .single(),
    );
  }
}

function pickCert(d) {
  const out = {};
  for (const k of ['title', 'type_key', 'hours', 'issued_on', 'issuer', 'status', 'event_id', 'notes', 'missing_requirements']) if (k in d) out[k] = d[k];
  if ('hours' in out) out.hours = Number(out.hours) || 0;
  if (out.issued_on === '') out.issued_on = null;
  if (out.event_id === '' || (out.event_id && String(out.event_id).startsWith('ex-'))) out.event_id = null;
  return out;
}

function translate(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.';
  if (m.includes('already registered')) return 'Já existe uma conta com esse e-mail.';
  if (m.includes('password should be')) return 'A senha precisa ter pelo menos 8 caracteres, com letras e números.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (m.includes('rate limit')) return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.';
  if (m.includes('row-level security') || m.includes('permission denied')) return 'Você não tem permissão para fazer isso.';
  if (m.includes('failed to fetch')) return 'Sem conexão com o servidor. Confira sua internet.';
  return msg;
}

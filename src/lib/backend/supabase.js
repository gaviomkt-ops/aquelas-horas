// MODO ONLINE: Supabase (Auth + Postgres + Storage). As regras de segurança ficam no
// banco (supabase/schema.sql): cada aluno só vê os próprios certificados, organizador só
// edita os próprios eventos e só o admin aprova.
import { createClient } from '@supabase/supabase-js';
import { coordinatesEvent } from '../roles.js';

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
    // "Esqueci a senha": o e-mail traz um código (digitado no app) e um botão com token_hash.
    // Os dois são conferidos por verifyOtp, então funcionam em qualquer navegador ou aparelho.
    async sendResetCode(email) {
      ok(await sb.auth.resetPasswordForEmail(String(email).trim().toLowerCase(), { redirectTo: window.location.origin + window.location.pathname }));
    },
    async verifyResetCode({ email, code }) {
      ok(await sb.auth.verifyOtp({ email: String(email).trim().toLowerCase(), token: String(code).replace(/\D/g, ''), type: 'recovery' }));
    },
    async verifyResetLink(tokenHash) {
      ok(await sb.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }));
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
      const allowed = ['name', 'institution_id', 'institution_type', 'institution_name', 'course_id', 'entry_year', 'semester', 'goal_hours', 'onboarded', 'role', 'org_name', 'org_instagram', 'org_bio', 'accepted_terms_at', 'password_set', 'student_number', 'class_group', 'secretaria_consent_at'];
      const clean = {};
      for (const k of allowed) if (k in patch) clean[k] = patch[k];
      try {
        return ok(await sb.from('profiles').update(clean).eq('id', id).select().single());
      } catch (e) {
        // banco ainda sem a migração do ano de ingresso: salva o resto em vez de travar o cadastro
        if ('entry_year' in clean && /entry_year/.test(String(e.message))) {
          delete clean.entry_year;
          return ok(await sb.from('profiles').update(clean).eq('id', id).select().single());
        }
        throw e;
      }
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
    // aprovação dupla (admin + coordenação do curso), feita no banco
    async approveEvent(id) {
      return ok(await sb.rpc('approve_event', { p_event: id }));
    },
    async rejectEvent(id, reason) {
      return ok(await sb.rpc('reject_event', { p_event: id, p_reason: reason || '' }));
    },
    async listCoordQueue() {
      // o banco devolve os eventos públicos + os do curso que a pessoa coordena; aqui ficam só os do curso
      const id = await uidOrThrow();
      const me = ok(await sb.from('profiles').select('role,institution_id,course_id').eq('id', id).maybeSingle());
      const rows = ok(await sb.from('events').select('*').order('created_at', { ascending: false }));
      return rows.filter((e) => coordinatesEvent(me, e));
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

    // ---------- presença (check-in pelo GPS + foto de evidência) ----------
    // O banco confere horário, distância e precisão do GPS (attendance_ping) e só guarda a distância.
    async myAttendance() {
      const { data: s } = await sb.auth.getSession();
      if (!s?.session) return [];
      return ok(await sb.from('attendance').select('*').eq('user_id', s.session.user.id));
    },
    async attendancePing(eventId, pos, mode = 'manual') {
      return ok(await sb.rpc('attendance_ping', { p_event: eventId, p_lat: pos.lat, p_lng: pos.lng, p_accuracy: pos.accuracy, p_mode: mode }));
    },
    async uploadAttendancePhoto(eventId, blob) {
      const id = await uidOrThrow();
      const type = blob.type || 'image/jpeg';
      const path = `${id}/${eventId}/${Date.now()}.${type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'}`;
      ok(await sb.storage.from('attendance-photos').upload(path, blob, { contentType: type, upsert: false }));
      return ok(await sb.rpc('attendance_set_photo', { p_event: eventId, p_path: path }));
    },
    async attendancePhotoUrl(path) {
      return ok(await sb.storage.from('attendance-photos').createSignedUrl(path, 60 * 10)).signedUrl;
    },
    async eventAttendance(eventId) {
      return ok(await sb.rpc('event_attendance', { p_event: eventId }));
    },
    async secListAttendance() {
      const id = await uidOrThrow();
      return ok(await sb.from('attendance').select('*, evento:events(title, starts_at, ends_at)').neq('user_id', id));
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

    // ---------- secretaria (piloto) ----------
    // O banco (RLS) só devolve alunos da instituição da secretaria que autorizaram o compartilhamento
    // e só os certificados que eles marcaram como enviados.
    async secListStudents(institutionId) {
      const id = await uidOrThrow();
      let q = sb
        .from('profiles')
        .select('id,name,email,institution_id,course_id,entry_year,semester,class_group,student_number,goal_hours,secretaria_consent_at')
        .eq('role', 'student')
        .not('secretaria_consent_at', 'is', null)
        .neq('id', id)
        .order('name');
      if (institutionId) q = q.eq('institution_id', institutionId);
      return ok(await q);
    },
    async secListCertificates() {
      const id = await uidOrThrow();
      return ok(await sb.from('certificates').select('*').neq('status', 'guardado').neq('user_id', id).order('created_at', { ascending: false }));
    },
    async reviewCertificate(certId, status, note) {
      return ok(await sb.from('certificates').update({ status, review_note: note?.trim() || null }).eq('id', certId).select().single());
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
  if (m.includes('different from the old')) return 'A senha nova precisa ser diferente da atual.';
  if (m.includes('link is invalid')) return 'Esse link do e-mail venceu ou já foi usado. Peça um código novo abaixo (vale só o último e-mail).';
  if (m.includes('token has expired') || m.includes('otp_expired') || m.includes('invalid otp')) return 'Código inválido ou vencido. Confira os números ou peça um código novo (vale só o último e-mail).';
  if (m.includes('only request this after')) return 'Espere alguns segundos antes de pedir outro código.';
  if (m.includes('not authorized') && m.includes('email')) return 'O envio de e-mails ainda não está liberado para esse endereço. Fale com a equipe do Àquelas Horas.';
  if (m.includes('error sending')) return 'Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos.';
  if (m.includes('auth session missing')) return 'Sua verificação expirou. Peça um código novo.';
  if (m.includes('password should be')) return 'A senha precisa ter pelo menos 8 caracteres, com letras e números.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (m.includes('rate limit')) return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.';
  if (m.includes('row-level security') || m.includes('permission denied')) return 'Você não tem permissão para fazer isso.';
  if (m.includes('failed to fetch')) return 'Sem conexão com o servidor. Confira sua internet.';
  return msg;
}

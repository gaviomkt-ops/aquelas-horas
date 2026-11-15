import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { INSTITUTIONS, INSTITUTION_TYPES, getInstitution } from '../lib/rules.js';
import { Button, Chip, Field, Icon, Logo } from '../components/ui.jsx';
import CursoFields, { cursoPatch } from '../components/CursoFields.jsx';

// Depois do cadastro (e da senha nova), a primeira pergunta é a instituição de ensino.
export default function Onboarding() {
  const { api, profile, refreshProfile, notify } = useStore();
  const startOrganizer = profile?.role === 'organizer';
  const [step, setStep] = useState(startOrganizer ? 'details' : 'inst');
  const [role, setRole] = useState(startOrganizer ? 'organizer' : 'student');
  const [f, setF] = useState({
    name: profile?.name || '',
    institution_id: profile?.institution_id || '',
    institution_type: profile?.institution_type || '',
    institution_name: profile?.institution_name || '',
    course_id: profile?.course_id || '',
    entry_year: profile?.entry_year || '',
    semester: profile?.semester || '',
    goal_hours: profile?.goal_hours || '',
    org_name: profile?.org_name || '',
    org_instagram: profile?.org_instagram || '',
    org_bio: profile?.org_bio || '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inst = f.institution_id ? getInstitution(f.institution_id) : null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const known = INSTITUTIONS.filter((i) => !i.custom);

  function pickInstitution(id) {
    const i = getInstitution(id);
    setError('');
    setF({ ...f, institution_id: i.id, institution_type: i.type || f.institution_type, course_id: i.custom ? 'OUTRO' : i.courses[0].id });
  }

  function nextFromInst(e) {
    e.preventDefault();
    setError('');
    if (!inst) return setError('Escolha sua instituição.');
    if (inst.custom) {
      if (!f.institution_type) return setError('Diga se é faculdade, universidade ou centro universitário.');
      if (f.institution_name.trim().length < 3) return setError('Digite o nome da sua instituição.');
    }
    setRole('student');
    setStep('details');
  }

  async function finish(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const base = { name: f.name.trim() || profile.name, onboarded: true, accepted_terms_at: profile.accepted_terms_at || new Date().toISOString() };
      if (role === 'student') {
        await api.saveMyProfile({
          ...base,
          role: 'student',
          institution_id: inst.id,
          institution_type: inst.custom ? f.institution_type : inst.type,
          institution_name: inst.custom ? f.institution_name.trim() : inst.name,
          ...cursoPatch(inst, f),
          semester: f.semester ? Number(f.semester) : null,
        });
      } else {
        await api.saveMyProfile({ ...base, role: 'organizer', org_name: f.org_name.trim(), org_instagram: f.org_instagram.trim(), org_bio: f.org_bio.trim() });
      }
      await refreshProfile();
      notify(role === 'student' ? 'Tudo pronto! Bora guardar o primeiro certificado.' : 'Cadastro enviado para aprovação.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (step === 'inst') {
    return (
      <div className="onb">
        <Logo height={84} />
        <h1>Oi, {profile?.name?.split(' ')[0]}! Onde você estuda?</h1>
        <p className="muted">Faculdade, universidade ou centro universitário. Usamos as regras de horas complementares da sua instituição.</p>
        <form className="stack" onSubmit={nextFromInst}>
          <div className="role-grid">
            {known.map((i) => (
              <button key={i.id} type="button" className={`role role-sm ${f.institution_id === i.id ? 'role-on' : ''}`} onClick={() => pickInstitution(i.id)}>
                <Icon name="GraduationCap" size={22} />
                <b>{i.name}</b>
                <span>
                  {INSTITUTION_TYPES.find((t) => t.id === i.type)?.label || 'Instituição de ensino'} · {i.city} · {i.catalog ? 'regras do catálogo (confira na secretaria)' : 'tabela de horas pronta'}
                </span>
              </button>
            ))}
            <button type="button" className={`role role-sm ${f.institution_id === 'outra' ? 'role-on' : ''}`} onClick={() => pickInstitution('outra')}>
              <Icon name="Building2" size={22} />
              <b>Outra instituição</b>
              <span>Você informa o nome e a meta de horas do seu curso.</span>
            </button>
          </div>

          {inst?.custom && (
            <>
              <Field label="Tipo de instituição">
                <div className="chips chips-wrap">
                  {INSTITUTION_TYPES.map((t) => (
                    <Chip key={t.id} active={f.institution_type === t.id} onClick={() => setF({ ...f, institution_type: t.id })}>
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Nome da instituição" htmlFor="iname" hint="Ex.: Univille, Católica de SC, UDESC, Unisociesc…">
                <input id="iname" value={f.institution_name} onChange={set('institution_name')} maxLength={120} required />
              </Field>
            </>
          )}

          {error && (
            <div className="alert alert-error" role="alert">
              <Icon name="CircleAlert" size={18} /> {error}
            </div>
          )}
          <Button type="submit" block size="lg">
            Continuar
          </Button>
        </form>
        <button
          type="button"
          className="link-btn center-link"
          onClick={() => {
            setRole('organizer');
            setStep('details');
          }}
        >
          Não estudo: organizo eventos
        </button>
      </div>
    );
  }

  return (
    <div className="onb">
      {!startOrganizer && (
        <button className="back-link" onClick={() => setStep('inst')} type="button">
          <Icon name="ChevronLeft" size={18} /> Voltar
        </button>
      )}
      <h1>{role === 'student' ? 'Seu curso' : 'Sua organização'}</h1>
      <p className="muted">
        {role === 'student'
          ? inst?.custom
            ? `Em ${f.institution_name.trim()}, diga quantas horas complementares seu curso exige.`
            : `Usamos a tabela de horas de ${inst?.name} para calcular quanto falta e o teto de cada categoria.`
          : 'Seu perfil passa por uma aprovação rápida da equipe antes de publicar eventos.'}
      </p>
      <form className="stack" onSubmit={finish}>
        <Field label="Seu nome" htmlFor="nm">
          <input id="nm" value={f.name} onChange={set('name')} maxLength={120} required />
        </Field>
        {role === 'student' ? (
          <>
            <CursoFields f={f} setF={setF} inst={inst} idPrefix="onb" />
            <Field label="Semestre atual" htmlFor="sem">
              <select id="sem" value={f.semester} onChange={set('semester')}>
                <option value="">Prefiro não dizer</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}º semestre
                  </option>
                ))}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Nome da organização" htmlFor="org" hint="Empresa, coletivo, centro acadêmico, produtora…">
              <input id="org" value={f.org_name} onChange={set('org_name')} maxLength={120} required />
            </Field>
            <Field label="Instagram (opcional)" htmlFor="ig">
              <input id="ig" value={f.org_instagram} onChange={set('org_instagram')} placeholder="@suaorganizacao" maxLength={80} />
            </Field>
            <Field label="Conte em uma frase o que vocês fazem" htmlFor="bio">
              <textarea id="bio" rows={3} value={f.org_bio} onChange={set('org_bio')} maxLength={600} />
            </Field>
          </>
        )}
        {error && (
          <div className="alert alert-error" role="alert">
            <Icon name="CircleAlert" size={18} /> {error}
          </div>
        )}
        <Button type="submit" block size="lg" loading={busy}>
          {role === 'student' ? 'Abrir meu cofre' : 'Enviar para aprovação'}
        </Button>
      </form>
    </div>
  );
}

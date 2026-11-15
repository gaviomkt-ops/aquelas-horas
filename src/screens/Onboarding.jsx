import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { INSTITUTIONS, getInstitution } from '../lib/rules.js';
import { Button, Field, Icon, Logo } from '../components/ui.jsx';

export default function Onboarding() {
  const { api, profile, refreshProfile, notify } = useStore();
  const [step, setStep] = useState(profile?.role === 'organizer' ? 2 : 1);
  const [role, setRole] = useState(profile?.role === 'organizer' ? 'organizer' : 'student');
  const [f, setF] = useState({
    name: profile?.name || '',
    institution_id: profile?.institution_id || 'ielusc',
    course_id: profile?.course_id || 'PP',
    semester: profile?.semester || '',
    goal_hours: profile?.goal_hours || '',
    org_name: profile?.org_name || '',
    org_instagram: profile?.org_instagram || '',
    org_bio: profile?.org_bio || '',
  });
  const [busy, setBusy] = useState(false);
  const inst = getInstitution(f.institution_id);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function finish(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const base = { name: f.name.trim() || profile.name, onboarded: true, accepted_terms_at: profile.accepted_terms_at || new Date().toISOString() };
      if (role === 'student') {
        await api.saveMyProfile({
          ...base,
          role: 'student',
          institution_id: f.institution_id,
          course_id: inst.courses.some((c) => c.id === f.course_id) ? f.course_id : inst.courses[0].id,
          semester: f.semester ? Number(f.semester) : null,
          goal_hours: inst.custom ? Number(f.goal_hours) || null : null,
        });
      } else {
        await api.saveMyProfile({ ...base, role: 'organizer', org_name: f.org_name.trim(), org_instagram: f.org_instagram.trim(), org_bio: f.org_bio.trim() });
      }
      await refreshProfile();
      notify(role === 'student' ? 'Tudo pronto! Bora guardar o primeiro certificado.' : 'Cadastro enviado para aprovação.');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  if (step === 1) {
    return (
      <div className="onb">
        <Logo height={84} />
        <h1>Oi, {profile?.name?.split(' ')[0]}! Como você vai usar o app?</h1>
        <div className="role-grid">
          <button className={`role ${role === 'student' ? 'role-on' : ''}`} onClick={() => setRole('student')} type="button">
            <Icon name="GraduationCap" size={28} />
            <b>Sou universitário</b>
            <span>Guardar certificados, ver quanto falta e achar eventos que valem horas.</span>
          </button>
          <button className={`role ${role === 'organizer' ? 'role-on' : ''}`} onClick={() => setRole('organizer')} type="button">
            <Icon name="CalendarCog" size={28} />
            <b>Organizo eventos</b>
            <span>Divulgar palestras, cursos e eventos com certificado para universitários.</span>
          </button>
        </div>
        <Button block size="lg" onClick={() => setStep(2)}>
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <div className="onb">
      <button className="back-link" onClick={() => setStep(1)} type="button">
        <Icon name="ChevronLeft" size={18} /> Voltar
      </button>
      <h1>{role === 'student' ? 'Seu curso' : 'Sua organização'}</h1>
      <p className="muted">
        {role === 'student'
          ? 'Usamos a tabela de horas complementares do seu curso para calcular quanto falta e onde está o teto de cada categoria.'
          : 'Seu perfil passa por uma aprovação rápida da equipe antes de publicar eventos.'}
      </p>
      <form className="stack" onSubmit={finish}>
        <Field label="Seu nome" htmlFor="nm">
          <input id="nm" value={f.name} onChange={set('name')} required />
        </Field>
        {role === 'student' ? (
          <>
            <Field label="Instituição" htmlFor="inst" hint={`Regras: ${inst.source}`}>
              <select
                id="inst"
                value={f.institution_id}
                onChange={(e) => {
                  const i = getInstitution(e.target.value);
                  setF({ ...f, institution_id: i.id, course_id: i.courses[0].id });
                }}
              >
                {INSTITUTIONS.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                    {i.city ? ` · ${i.city}` : ''}
                  </option>
                ))}
              </select>
            </Field>
            {!inst.custom && (
              <Field label="Curso" htmlFor="course">
                <select id="course" value={f.course_id} onChange={set('course_id')}>
                  {inst.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.goal}h)
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {inst.custom && (
              <Field label="Quantas horas complementares seu curso exige?" htmlFor="goal" hint="Confira no regulamento do seu curso.">
                <input id="goal" type="number" min="1" max="2000" inputMode="numeric" value={f.goal_hours} onChange={set('goal_hours')} required />
              </Field>
            )}
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
              <input id="org" value={f.org_name} onChange={set('org_name')} required />
            </Field>
            <Field label="Instagram (opcional)" htmlFor="ig">
              <input id="ig" value={f.org_instagram} onChange={set('org_instagram')} placeholder="@suaorganizacao" />
            </Field>
            <Field label="Conte em uma frase o que vocês fazem" htmlFor="bio">
              <textarea id="bio" rows={3} value={f.org_bio} onChange={set('org_bio')} />
            </Field>
          </>
        )}
        <Button type="submit" block size="lg" loading={busy}>
          {role === 'student' ? 'Abrir meu cofre' : 'Enviar para aprovação'}
        </Button>
      </form>
    </div>
  );
}

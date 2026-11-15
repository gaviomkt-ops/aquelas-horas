import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { isDemo } from '../lib/backend/index.js';
import { INSTITUTIONS, getCourse, getInstitution } from '../lib/rules.js';
import { Avatar, Badge, Button, Field, Icon } from '../components/ui.jsx';
import { InstallButton } from '../components/InstallApp.jsx';

const ROLE = { student: 'Universitário', organizer: 'Organizador', admin: 'Administrador' };

export default function Profile() {
  const { api, profile, refreshProfile, notify } = useStore();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState(profile);
  const [busy, setBusy] = useState(false);
  const inst = getInstitution(f.institution_id);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const patch = { name: f.name.trim() };
      if (profile.role === 'student') {
        Object.assign(patch, {
          institution_id: f.institution_id,
          course_id: inst.courses.some((c) => c.id === f.course_id) ? f.course_id : inst.courses[0].id,
          semester: f.semester ? Number(f.semester) : null,
          goal_hours: inst.custom ? Number(f.goal_hours) || null : null,
        });
      }
      if (profile.role === 'organizer') Object.assign(patch, { org_name: f.org_name?.trim(), org_instagram: f.org_instagram?.trim(), org_bio: f.org_bio?.trim() });
      await api.saveMyProfile(patch);
      await refreshProfile();
      setEdit(false);
      notify('Perfil atualizado.');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    const ok = window.prompt('Isso apaga sua conta, seus certificados e arquivos para sempre. Para confirmar, digite APAGAR');
    if (ok !== 'APAGAR') return;
    try {
      await api.deleteMyAccount();
      notify('Conta apagada.');
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  const course = profile.role === 'student' ? getCourse(profile.institution_id, profile.course_id) : null;

  return (
    <div className="page">
      <header className="profile-head">
        <Avatar name={profile.name} size={72} />
        <h1>{profile.name}</h1>
        <p className="muted">{profile.email}</p>
        <div className="row-gap wrap center">
          <Badge tone="brand">{ROLE[profile.role]}</Badge>
          {profile.role === 'organizer' && <Badge tone={profile.org_status === 'approved' ? 'ok' : profile.org_status === 'rejected' ? 'error' : 'warn'}>{profile.org_status === 'approved' ? 'Aprovado' : profile.org_status === 'rejected' ? 'Não aprovado' : 'Em análise'}</Badge>}
        </div>
        {course && (
          <p className="muted small">
            {getInstitution(profile.institution_id).name} · {course.name}
            {profile.semester ? ` · ${profile.semester}º semestre` : ''}
          </p>
        )}
      </header>

      {!edit ? (
        <div className="menu">
          <button className="menu-item" onClick={() => setEdit(true)}>
            <Icon name="UserPen" /> <span>Editar perfil</span> <Icon name="ChevronRight" size={18} />
          </button>
          {profile.role === 'student' && (
            <Link className="menu-item" to="/relatorio">
              <Icon name="FileText" /> <span>Relatório acadêmico</span> <Icon name="ChevronRight" size={18} />
            </Link>
          )}
          <InstallButton variant="menu" />
          <Link className="menu-item" to="/privacidade">
            <Icon name="Lock" /> <span>Privacidade</span> <Icon name="ChevronRight" size={18} />
          </Link>
          <Link className="menu-item" to="/termos">
            <Icon name="ScrollText" /> <span>Termos de uso</span> <Icon name="ChevronRight" size={18} />
          </Link>
          <button className="menu-item" onClick={() => api.signOut()}>
            <Icon name="LogOut" /> <span>Sair</span> <Icon name="ChevronRight" size={18} />
          </button>
          <button className="menu-item menu-danger" onClick={del}>
            <Icon name="Trash2" /> <span>Excluir minha conta</span> <Icon name="ChevronRight" size={18} />
          </button>
          {isDemo && (
            <button
              className="menu-item"
              onClick={async () => {
                if (window.confirm('Voltar o modo demonstração ao estado inicial?')) {
                  await api.resetDemo();
                  window.location.reload();
                }
              }}
            >
              <Icon name="RotateCcw" /> <span>Reiniciar demonstração</span> <Icon name="ChevronRight" size={18} />
            </button>
          )}
        </div>
      ) : (
        <form className="stack card-pad" onSubmit={save}>
          <Field label="Nome" htmlFor="pn">
            <input id="pn" value={f.name || ''} onChange={set('name')} required />
          </Field>
          {profile.role === 'student' && (
            <>
              <Field label="Instituição" htmlFor="pi">
                <select
                  id="pi"
                  value={f.institution_id}
                  onChange={(e) => {
                    const i = getInstitution(e.target.value);
                    setF({ ...f, institution_id: i.id, course_id: i.courses[0].id });
                  }}
                >
                  {INSTITUTIONS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </Field>
              {!inst.custom ? (
                <Field label="Curso" htmlFor="pc">
                  <select id="pc" value={f.course_id} onChange={set('course_id')}>
                    {inst.courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.goal}h)
                      </option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="Meta de horas do curso" htmlFor="pg">
                  <input id="pg" type="number" min="1" max="2000" value={f.goal_hours || ''} onChange={set('goal_hours')} required />
                </Field>
              )}
              <Field label="Semestre" htmlFor="ps">
                <select id="ps" value={f.semester || ''} onChange={set('semester')}>
                  <option value="">Prefiro não dizer</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}º semestre
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
          {profile.role === 'organizer' && (
            <>
              <Field label="Organização" htmlFor="po">
                <input id="po" value={f.org_name || ''} onChange={set('org_name')} required />
              </Field>
              <Field label="Instagram" htmlFor="pig">
                <input id="pig" value={f.org_instagram || ''} onChange={set('org_instagram')} />
              </Field>
              <Field label="Sobre" htmlFor="pb">
                <textarea id="pb" rows={3} value={f.org_bio || ''} onChange={set('org_bio')} />
              </Field>
            </>
          )}
          <Button type="submit" block loading={busy}>
            Salvar
          </Button>
          <Button
            type="button"
            variant="ghost"
            block
            onClick={() => {
              setF(profile);
              setEdit(false);
            }}
          >
            Cancelar
          </Button>
        </form>
      )}
    </div>
  );
}

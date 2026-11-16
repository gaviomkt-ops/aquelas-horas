import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { formatHours } from '../lib/progress.js';
import { Avatar, Badge, Bar, Button, Empty, Icon, Segmented } from '../components/ui.jsx';
import { EventRow } from './OrgHome.jsx';
import { INSTITUTIONS, getInstitution } from '../lib/rules.js';
import { ROLE_LABEL } from '../lib/roles.js';

export default function Admin() {
  const { api, counts, notify, loadEvents, user } = useStore();
  const [tab, setTab] = useState('numeros');
  const [stats, setStats] = useState(null);
  const [people, setPeople] = useState([]);
  const orgs = useMemo(() => people.filter((p) => p.role === 'organizer'), [people]);
  const [events, setEvents] = useState([]);

  const load = useCallback(async () => {
    try {
      const [s, o, e] = await Promise.all([api.stats(), api.listProfiles({}), api.listAllEvents()]);
      setStats(s);
      setPeople(o);
      setEvents(e);
    } catch (err) {
      notify(err.message, 'error');
    }
  }, [api, notify]);
  useEffect(() => {
    load();
  }, [load]);

  async function run(fn, msg) {
    try {
      const r = await fn();
      notify(typeof msg === 'function' ? msg(r) : msg);
      await Promise.all([load(), loadEvents()]);
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  const pendingOrgs = orgs.filter((o) => o.org_status === 'pending');
  const pendingEvents = events.filter((e) => e.status === 'pending');
  const boostReq = events.filter((e) => e.boost_status === 'requested' && e.status === 'approved');
  const boostOn = events.filter((e) => e.boost_status === 'active');

  const reject = (ev) => {
    const reason = window.prompt('Motivo da recusa (o organizador vai ver):', '');
    if (reason === null) return;
    run(() => api.rejectEvent(ev.id, reason), 'Evento recusado.');
  };
  // aprovação dupla: o banco só publica com admin + coordenação do curso (se o curso tiver coordenação no app)
  const approve = (ev) =>
    run(() => api.approveEvent(ev.id), (st) => (st === 'approved' ? 'Evento publicado.' : 'Aprovado pelo admin. Falta a coordenação do curso.'));
  const activateBoost = (ev) => {
    const days = Number(window.prompt('Destacar por quantos dias?', '7'));
    if (!(days > 0)) return;
    const until = new Date(Date.now() + days * 86400000).toISOString();
    run(() => api.adminUpdateEvent(ev.id, { boost_status: 'active', boost_until: until }), `Destaque ligado por ${days} dias.`);
  };

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Equipe Àquelas Horas</span>
          <h1 className="top-title">Painel</h1>
        </div>
        <button className="icon-btn icon-btn-soft" onClick={load} aria-label="Atualizar">
          <Icon name="RefreshCw" />
        </button>
      </header>

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'numeros', label: 'Números' },
          { value: 'eventos', label: 'Eventos', count: pendingEvents.length || null },
          { value: 'orgs', label: 'Organizadores', count: pendingOrgs.length || null },
          { value: 'equipe', label: 'Equipe' },
          { value: 'destaque', label: 'Destaques', count: boostReq.length || null },
        ]}
      />

      {tab === 'numeros' && stats && (
        <>
          <div className="kpis kpis-big">
            <div>
              <b>{stats.students}</b>
              <span>universitários</span>
            </div>
            <div>
              <b>{stats.signups_today}</b>
              <span>cadastros hoje</span>
            </div>
            <div>
              <b>{stats.certificates}</b>
              <span>certificados guardados</span>
            </div>
            <div>
              <b>{formatHours(Number(stats.hours))}</b>
              <span>em certificados</span>
            </div>
            <div>
              <b>{stats.organizers}</b>
              <span>organizadores</span>
            </div>
            <div>
              <b>
                {stats.approved_events}/{stats.events}
              </b>
              <span>eventos publicados</span>
            </div>
            <div>
              <b>{stats.going}</b>
              <span>marcações “vou”</span>
            </div>
          </div>
          {stats.storage_mb != null && (
            <div className="card-pad stack">
              <div className="row-between">
                <b>Espaço de arquivos</b>
                <span className="muted small">
                  {Number(stats.storage_mb).toLocaleString('pt-BR')} MB de 1.024 MB (plano grátis)
                </span>
              </div>
              <Bar value={Number(stats.storage_mb)} max={1024} tone="brand" />
              {Number(stats.storage_mb) > 750 && <p className="alert alert-warn">Passou de 75% do espaço grátis. Considere o plano pago do Supabase ou limpar arquivos antigos.</p>}
            </div>
          )}
          <p className="muted small">Use estes números como prova de tração na banca. Atualize na hora da apresentação.</p>
          {(pendingEvents.length > 0 || pendingOrgs.length > 0 || boostReq.length > 0) && (
            <div className="todo">
              <h2 className="sec-title sm">Pendências</h2>
              {pendingEvents.length > 0 && (
                <button className="menu-item" onClick={() => setTab('eventos')}>
                  <Icon name="CalendarClock" /> <span>{pendingEvents.length} evento(s) aguardando aprovação</span> <Icon name="ChevronRight" size={18} />
                </button>
              )}
              {pendingOrgs.length > 0 && (
                <button className="menu-item" onClick={() => setTab('orgs')}>
                  <Icon name="UserCheck" /> <span>{pendingOrgs.length} organizador(es) para aprovar</span> <Icon name="ChevronRight" size={18} />
                </button>
              )}
              {boostReq.length > 0 && (
                <button className="menu-item" onClick={() => setTab('destaque')}>
                  <Icon name="Flame" /> <span>{boostReq.length} pedido(s) de destaque</span> <Icon name="ChevronRight" size={18} />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'eventos' && (
        <div className="org-list">
          <h2 className="sec-title sm">Aguardando aprovação</h2>
          {!pendingEvents.length && <p className="muted">Nada pendente.</p>}
          {pendingEvents.map((ev) => (
            <EventRow
              key={ev.id}
              event={ev}
              counts={counts}
              actions={
                <div className="row-gap">
                  {!ev.admin_approved_at ? (
                    <Button size="sm" icon="Check" onClick={() => approve(ev)}>
                      Aprovar
                    </Button>
                  ) : (
                    <span className="muted small">Você já aprovou. Falta a coordenação.</span>
                  )}
                  <Button size="sm" variant="ghost" icon="X" onClick={() => reject(ev)}>
                    Recusar
                  </Button>
                </div>
              }
            />
          ))}
          <h2 className="sec-title sm">Todos os eventos</h2>
          {events
            .filter((e) => e.status !== 'pending')
            .map((ev) => (
              <EventRow
                key={ev.id}
                event={ev}
                counts={counts}
                actions={
                  <div className="row-gap">
                    {ev.status === 'approved' ? (
                      <Button size="sm" variant="ghost" icon="EyeOff" onClick={() => reject(ev)}>
                        Tirar do ar
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" icon="Check" onClick={() => approve(ev)}>
                        Aprovar de novo
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      aria-label="Apagar"
                      onClick={() => window.confirm(`Apagar "${ev.title}"?`) && run(() => api.deleteEvent(ev.id), 'Evento apagado.')}
                    />
                  </div>
                }
              />
            ))}
        </div>
      )}

      {tab === 'equipe' && <TeamTab people={people} me={user?.id} onSave={(id, patch, msg) => run(() => api.adminUpdateProfile(id, patch), msg)} />}

      {tab === 'orgs' && (
        <div className="stack">
          {!orgs.length && <Empty icon="Users" title="Nenhum organizador ainda" />}
          {[...pendingOrgs, ...orgs.filter((o) => o.org_status !== 'pending')].map((o) => (
            <article key={o.id} className="org-card">
              <Avatar name={o.org_name || o.name} size={44} />
              <div className="org-card-body">
                <h3>{o.org_name || '(sem nome)'}</h3>
                <p>
                  {o.name} · {o.email}
                </p>
                {o.org_instagram && <p>Instagram: {o.org_instagram}</p>}
                {o.org_bio && <p className="muted">{o.org_bio}</p>}
                <div className="row-gap wrap">
                  <Badge tone={o.org_status === 'approved' ? 'ok' : o.org_status === 'rejected' ? 'error' : 'warn'}>
                    {o.org_status === 'approved' ? 'Aprovado' : o.org_status === 'rejected' ? 'Recusado' : 'Pendente'}
                  </Badge>
                  {o.org_status !== 'approved' && (
                    <Button size="sm" icon="Check" onClick={() => run(() => api.adminUpdateProfile(o.id, { org_status: 'approved' }), 'Organizador aprovado.')}>
                      Aprovar
                    </Button>
                  )}
                  {o.org_status !== 'rejected' && (
                    <Button size="sm" variant="ghost" icon="X" onClick={() => run(() => api.adminUpdateProfile(o.id, { org_status: 'rejected' }), 'Organizador recusado.')}>
                      Recusar
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'destaque' && (
        <div className="org-list">
          <h2 className="sec-title sm">Pedidos</h2>
          {!boostReq.length && <p className="muted">Nenhum pedido de destaque.</p>}
          {boostReq.map((ev) => (
            <EventRow
              key={ev.id}
              event={ev}
              counts={counts}
              actions={
                <div className="row-gap">
                  <Button size="sm" icon="Flame" onClick={() => activateBoost(ev)}>
                    Ligar destaque
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => run(() => api.adminUpdateEvent(ev.id, { boost_status: 'none' }), 'Pedido recusado.')}>
                    Recusar
                  </Button>
                </div>
              }
            />
          ))}
          <h2 className="sec-title sm">Em destaque agora</h2>
          {!boostOn.length && <p className="muted">Nenhum evento em destaque.</p>}
          {boostOn.map((ev) => (
            <EventRow
              key={ev.id}
              event={ev}
              counts={counts}
              actions={
                <div className="row-gap">
                  <span className="muted small">até {ev.boost_until ? new Date(ev.boost_until).toLocaleDateString('pt-BR') : '—'}</span>
                  <Button size="sm" variant="ghost" onClick={() => run(() => api.adminUpdateEvent(ev.id, { boost_status: 'none', boost_until: null }), 'Destaque desligado.')}>
                    Desligar
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Equipe: o admin define quem é coordenação de curso, secretaria, organizador ou admin.
function TeamTab({ people, me, onSave }) {
  const [q, setQ] = useState('');
  const norm = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const list = people.filter((p) => !q.trim() || norm(`${p.name} ${p.email} ${p.org_name}`).includes(norm(q)));
  return (
    <div className="stack">
      <p className="muted small">
        A pessoa precisa ter se cadastrado no app. Coordenação aprova eventos do curso dela; secretaria valida certificados que os alunos enviam. Ninguém consegue se dar esses papéis sozinho.
      </p>
      <div className="search">
        <Icon name="Search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail" aria-label="Buscar pessoas" />
      </div>
      {!list.length && <Empty icon="Users" title="Ninguém encontrado" />}
      {list.map((p) => (
        <PersonRow key={p.id} p={p} self={p.id === me} onSave={onSave} />
      ))}
    </div>
  );
}

function PersonRow({ p, self, onSave }) {
  const [role, setRole] = useState(p.role);
  const [inst, setInst] = useState(p.institution_id || 'ielusc');
  const [course, setCourse] = useState(p.course_id || '');
  const courses = getInstitution(inst).courses || [];
  const changed = role !== p.role || ((role === 'coordenador' || role === 'secretaria') && (inst !== (p.institution_id || 'ielusc') || (role === 'coordenador' && course !== (p.course_id || ''))));

  function save() {
    const patch = { role };
    if (role === 'organizer') patch.org_status = 'approved';
    if (role === 'student') patch.org_status = null;
    if (role === 'coordenador') Object.assign(patch, { institution_id: inst, course_id: course || null, onboarded: true });
    if (role === 'secretaria') Object.assign(patch, { institution_id: inst, onboarded: true });
    const label = ROLE_LABEL[role] || role;
    if (!window.confirm(`Mudar ${p.name || p.email} para "${label}"?`)) return;
    onSave(p.id, patch, `${p.name || p.email} agora é ${label}.`);
  }

  return (
    <article className="org-card">
      <Avatar name={p.name || p.email} size={40} />
      <div className="org-card-body">
        <h3>{p.name || '(sem nome)'}</h3>
        <p>{p.email}</p>
        <div className="row-gap wrap">
          <Badge tone={p.role === 'admin' ? 'brand' : p.role === 'student' ? 'neutral' : 'ok'}>{ROLE_LABEL[p.role] || p.role}</Badge>
          {p.institution_name && <span className="muted small">{p.institution_name}{p.course_id ? ` · ${p.course_id}` : ''}</span>}
        </div>
        {self ? (
          <p className="muted small">Esta é a sua conta.</p>
        ) : (
          <div className="team-edit">
            <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Papel">
              {Object.entries(ROLE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            {(role === 'coordenador' || role === 'secretaria') && (
              <select value={inst} onChange={(e) => { setInst(e.target.value); setCourse(''); }} aria-label="Instituição">
                {INSTITUTIONS.filter((i) => !i.custom).map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            )}
            {role === 'coordenador' && (
              <select value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Curso">
                <option value="">Todos os cursos</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            <Button size="sm" disabled={!changed} onClick={save}>
              Salvar
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

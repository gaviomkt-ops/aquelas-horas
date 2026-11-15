import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { formatHours } from '../lib/progress.js';
import { Avatar, Badge, Bar, Button, Empty, Icon, Segmented } from '../components/ui.jsx';
import { EventRow } from './OrgHome.jsx';

export default function Admin() {
  const { api, counts, notify, loadEvents } = useStore();
  const [tab, setTab] = useState('numeros');
  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [events, setEvents] = useState([]);

  const load = useCallback(async () => {
    try {
      const [s, o, e] = await Promise.all([api.stats(), api.listProfiles({ role: 'organizer' }), api.listAllEvents()]);
      setStats(s);
      setOrgs(o);
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
      await fn();
      notify(msg);
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
    run(() => api.adminUpdateEvent(ev.id, { status: 'rejected', reject_reason: reason }), 'Evento recusado.');
  };
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
                  <Button size="sm" icon="Check" onClick={() => run(() => api.adminUpdateEvent(ev.id, { status: 'approved', reject_reason: null }), 'Evento publicado.')}>
                    Aprovar
                  </Button>
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
                      <Button size="sm" variant="ghost" icon="Check" onClick={() => run(() => api.adminUpdateEvent(ev.id, { status: 'approved', reject_reason: null }), 'Evento publicado.')}>
                        Publicar
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

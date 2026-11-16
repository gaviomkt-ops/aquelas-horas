import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { dateRangeLabel, timeLabel, isPast } from '../lib/format.js';
import { formatHours } from '../lib/progress.js';
import { Badge, Button, Empty, EventCover, Icon } from '../components/ui.jsx';

export const EV_STATUS = { pending: ['Em análise', 'warn'], approved: ['Publicado', 'ok'], rejected: ['Recusado', 'error'] };
export const BOOST = { none: null, requested: ['Destaque solicitado', 'warn'], active: ['Em destaque', 'brand'] };

export function EventRow({ event, counts, actions }) {
  const c = counts[event.id] || { going: 0, saved: 0 };
  const st = EV_STATUS[event.status];
  const bs = BOOST[event.boost_status];
  return (
    <article className="org-ev">
      <Link to={`/evento/${event.id}`} className="org-ev-top">
        <div className="org-ev-media">
          <EventCover event={event} />
        </div>
        <div className="org-ev-body">
          <h3>{event.title}</h3>
          <p>
            {dateRangeLabel(event)} · {timeLabel(event.starts_at)} · {formatHours(event.hours)}
          </p>
          <div className="row-gap wrap">
            <Badge tone={st[1]}>{st[0]}</Badge>
            {bs && <Badge tone={bs[1]} icon="Flame">{bs[0]}</Badge>}
            {isPast(event) && <Badge tone="neutral">Encerrado</Badge>}
          </div>
          {event.status === 'pending' && (
            <p className="approval-line">
              <span className={event.admin_approved_at ? 'ok' : ''}>
                <Icon name={event.admin_approved_at ? 'CircleCheck' : 'Hourglass'} size={13} /> Admin
              </span>
              <span className={event.coord_approved_at ? 'ok' : ''}>
                <Icon name={event.coord_approved_at ? 'CircleCheck' : 'Hourglass'} size={13} /> Coordenação do curso
              </span>
            </p>
          )}
          {event.organizer_name && <p className="muted small">por {event.organizer_name}</p>}
        </div>
      </Link>
      <div className="org-ev-stats">
        <span>
          <Icon name="Eye" size={15} /> {event.views || 0}
        </span>
        <span>
          <Icon name="MousePointerClick" size={15} /> {event.link_clicks || 0}
        </span>
        <span>
          <Icon name="Users" size={15} /> {c.going}
        </span>
        <span>
          <Icon name="Bookmark" size={15} /> {c.saved}
        </span>
      </div>
      {event.link && (
        <p className="link-plain">
          <Icon name="ExternalLink" size={13} /> {event.link}
        </p>
      )}
      {event.status === 'rejected' && event.reject_reason && <p className="alert alert-error">Motivo: {event.reject_reason}</p>}
      {actions}
    </article>
  );
}

export default function OrgHome() {
  const { api, profile, counts, notify, loadEvents } = useStore();
  const [mine, setMine] = useState(null);

  const load = useCallback(async () => {
    try {
      setMine(await api.listMyEvents());
    } catch (e) {
      notify(e.message, 'error');
      setMine([]);
    }
  }, [api, notify]);
  useEffect(() => {
    load();
  }, [load]);

  if (profile.org_status !== 'approved') {
    const rejected = profile.org_status === 'rejected';
    return (
      <div className="page">
        <Empty icon={rejected ? 'CircleX' : 'Hourglass'} title={rejected ? 'Cadastro não aprovado' : 'Cadastro em análise'} text={rejected ? 'Seu perfil de organizador não foi aprovado. Fale com a equipe do Àquelas Horas para entender o motivo.' : `Recebemos o cadastro de ${profile.org_name || 'sua organização'}. Você será liberado para publicar eventos assim que a equipe aprovar.`}>
          <Link to="/explorar" className="btn btn-ghost">
            Ver a vitrine de eventos
          </Link>
        </Empty>
      </div>
    );
  }

  async function boost(ev) {
    try {
      await api.updateEvent(ev.id, { boost_status: 'requested' });
      notify('Pedido de destaque enviado. A equipe entra em contato para combinar.');
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
  }
  async function remove(ev) {
    if (!window.confirm(`Apagar "${ev.title}"? Não dá para desfazer.`)) return;
    try {
      await api.deleteEvent(ev.id);
      notify('Evento apagado.');
      load();
      loadEvents();
    } catch (e) {
      notify(e.message, 'error');
    }
  }

  const totals = (mine || []).reduce(
    (s, e) => ({ views: s.views + (e.views || 0), clicks: s.clicks + (e.link_clicks || 0), going: s.going + (counts[e.id]?.going || 0) }),
    { views: 0, clicks: 0, going: 0 },
  );

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">{profile.org_name}</span>
          <h1 className="top-title">Meus eventos</h1>
        </div>
        <Link to="/evento/novo" className="btn btn-primary btn-sm">
          <Icon name="Plus" size={16} /> <span>Novo</span>
        </Link>
      </header>

      <div className="kpis">
        <div>
          <b>{mine?.length ?? '–'}</b>
          <span>eventos</span>
        </div>
        <div>
          <b>{totals.views}</b>
          <span>visualizações</span>
        </div>
        <div>
          <b>{totals.clicks}</b>
          <span>cliques</span>
        </div>
        <div>
          <b>{totals.going}</b>
          <span>vão</span>
        </div>
      </div>

      <div className="tip">
        <Icon name="Flame" size={20} />
        <p>
          <b>Impulsione um evento</b> para ele aparecer no topo, no carrossel “Em alta”, para todos os universitários.
        </p>
      </div>

      {mine === null && <div className="center-pad"><span className="spinner spinner-dark" /></div>}
      {mine?.length === 0 && (
        <Empty icon="CalendarPlus" title="Nenhum evento ainda" text="Publique seu primeiro evento. Ele passa por uma revisão rápida antes de aparecer na vitrine.">
          <Link to="/evento/novo" className="btn btn-primary">
            Criar evento
          </Link>
        </Empty>
      )}
      <div className="org-list">
        {mine?.map((ev) => (
          <EventRow
            key={ev.id}
            event={ev}
            counts={counts}
            actions={
              <div className="row-gap">
                <Link to={`/evento/${ev.id}/editar`} className="btn btn-ghost btn-sm">
                  <Icon name="Pencil" size={15} /> <span>Editar</span>
                </Link>
                {ev.boost_status === 'none' && ev.status !== 'rejected' && !isPast(ev) && (
                  <Button size="sm" variant="soft" icon="Flame" onClick={() => boost(ev)}>
                    Impulsionar
                  </Button>
                )}
                <Button size="sm" variant="ghost" icon="Trash2" onClick={() => remove(ev)} aria-label="Apagar" />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

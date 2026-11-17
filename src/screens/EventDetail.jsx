import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { coordinatesEvent, isStudentLike } from '../lib/roles.js';
import { hasGeo } from '../lib/presence.js';
import { PresenceCard } from '../components/Presence.jsx';
import { eventCategory, typeForEvent, typeLabel } from '../lib/rules.js';
import { fullDate, timeLabel, priceLabel, dateRangeLabel, isPast, isLive, ymd, safeUrl } from '../lib/format.js';
import { formatHours } from '../lib/progress.js';
import { useHoursFit } from '../components/events.jsx';
import { Badge, Button, Empty, EventCover, Icon } from '../components/ui.jsx';
import CertificateForm from './CertificateForm.jsx';
import { CertificatePreview, eventCertChecks } from '../components/certificate.jsx';

const STATUS = { pending: ['Em análise', 'warn'], approved: ['Publicado', 'ok'], rejected: ['Recusado', 'error'] };

export default function EventDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { api, user, profile, events, counts, has, toggle, notify } = useStore();
  const [event, setEvent] = useState(() => events.find((e) => e.id === id) || null);
  const [loading, setLoading] = useState(!event);
  const [addOpen, setAddOpen] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    let alive = true;
    api
      .getEvent(id)
      .then((e) => alive && setEvent(e))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [api, id]);

  useEffect(() => {
    if (event?.status === 'approved' && !tracked.current && event.organizer_id !== user?.id) {
      tracked.current = true;
      api.track(event.id, 'view');
    }
  }, [event, api, user]);

  const fit = useHoursFit(event || { hours: 0, category: 'outros' });

  if (loading) return <div className="page center-pad"><span className="spinner spinner-dark" /></div>;
  if (!event)
    return (
      <div className="page">
        <Empty icon="CalendarX2" title="Evento não encontrado" text="Ele pode ter sido removido ou ainda não foi aprovado.">
          <Button variant="ghost" onClick={() => nav('/')}>Voltar ao início</Button>
        </Empty>
      </div>
    );

  const cat = eventCategory(event.category);
  const c = counts[event.id] || { going: 0, saved: 0 };
  const going = has(event.id, 'going');
  const saved = has(event.id, 'saved');
  const isOwner = user && (event.organizer_id === user.id || profile?.role === 'admin');
  const isStudent = isStudentLike(profile);
  const past = isPast(event);
  const typeKey = isStudent ? typeForEvent(profile, event.category) : null;
  const hasHours = Number(event.hours) > 0;
  const multiDay = ymd(event.starts_at) !== ymd(event.ends_at || event.starts_at);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([event.location, event.address, event.city].filter(Boolean).join(', '))}`;

  async function share() {
    const url = window.location.href;
    const text = `${event.title} · ${dateRangeLabel(event)}${Number(event.hours) > 0 ? ` · vale ${formatHours(event.hours)} complementares` : ''}`;
    try {
      if (navigator.share) await navigator.share({ title: event.title, text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        notify('Link copiado!');
      }
    } catch {
      /* usuário cancelou */
    }
  }

  const href = safeUrl(event.link);
  function openLink() {
    if (!href) return;
    api.track(event.id, 'click');
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="page page-flush">
      <div className="detail-hero">
        <EventCover event={event} />
        <div className="detail-hero-bar">
          <button className="icon-btn icon-btn-glass" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label="Voltar">
            <Icon name="ChevronLeft" />
          </button>
          <div className="row-gap">
            {user && (
              <button className={`icon-btn icon-btn-glass ${saved ? 'is-on' : ''}`} onClick={() => toggle(event.id, 'saved')} aria-label={saved ? 'Remover dos salvos' : 'Salvar'}>
                <Icon name="Bookmark" fill={saved ? 'currentColor' : 'none'} />
              </button>
            )}
            <button className="icon-btn icon-btn-glass" onClick={share} aria-label="Compartilhar">
              <Icon name="Share2" />
            </button>
          </div>
        </div>
        {isLive(event) && (
          <span className="pill-live pill-live-lg">
            <i /> Acontecendo agora
          </span>
        )}
      </div>

      <div className="detail">
        <div className="row-gap wrap">
          <Badge tone="neutral" icon={cat.icon}>
            {cat.label}
          </Badge>
          {event.is_example && <Badge tone="warn">Evento de exemplo</Badge>}
          {isOwner && <Badge tone={STATUS[event.status][1]}>{STATUS[event.status][0]}</Badge>}
        </div>
        <h1 className="detail-title">{event.title}</h1>
        <p className="muted">por {event.organizer_name || 'Organizador'}</p>

        <div className={`fit-box fit-${fit.tone}`}>
          <div className="fit-hours">
            <Icon name="Clock3" size={22} />
            {hasHours ? (
              <>
                <b>{formatHours(event.hours)}</b>
                <span>complementares</span>
              </>
            ) : (
              <span>Carga horária a confirmar com o organizador</span>
            )}
          </div>
          {isStudent && hasHours && (
            <p>
              {typeKey ? (
                <>
                  Conta como <b>{typeLabel(profile.institution_id, typeKey)}</b>.{' '}
                  {fit.tone === 'muted' ? 'Você já bateu o teto dessa categoria.' : fit.room !== undefined && fit.room !== Infinity ? `Você ainda tem ${formatHours(fit.room)} livres nela.` : ''}
                </>
              ) : (
                'Essa categoria não aparece na tabela do seu curso. Confirme com a coordenação.'
              )}
            </p>
          )}
          {!isStudent && !user && <p>Crie sua conta para ver quanto esse evento conta no seu curso.</p>}
        </div>

        <ul className="info-list">
          <li>
            <Icon name="Calendar" />
            <div>
              <b>{fullDate(event.starts_at)}</b>
              <span>
                {multiDay
                  ? timeLabel(event.starts_at) === '00:00'
                    ? `Até ${fullDate(event.ends_at).toLowerCase()}`
                    : `Começa às ${timeLabel(event.starts_at)} · termina ${fullDate(event.ends_at).toLowerCase()}`
                  : `${timeLabel(event.starts_at)}${event.ends_at ? ` às ${timeLabel(event.ends_at)}` : ''}`}
              </span>
            </div>
          </li>
          <li>
            <Icon name="MapPin" />
            <div>
              <b>{event.location || 'Local a definir'}</b>
              <span>{[event.address, event.city].filter(Boolean).join(' · ')}</span>
              {event.location && !/online/i.test(event.location) && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-link">
                  Abrir no mapa <Icon name="ExternalLink" size={14} />
                </a>
              )}
            </div>
          </li>
          <li>
            <Icon name="Ticket" />
            <div>
              <b>
                {priceLabel(event.price)}
                {event.capacity ? ` · ${event.capacity} vagas` : ''}
              </b>
              {event.courses?.length > 0 && <span>Indicado para: {event.courses.join(', ')}</span>}
            </div>
          </li>
          <li>
            <Icon name="Users" />
            <div>
              <b>{c.going} {c.going === 1 ? 'pessoa vai' : 'pessoas vão'}</b>
              <span>{c.saved} salvaram</span>
            </div>
          </li>
        </ul>

        {event.requirements?.length > 0 && (
          <section className="sec">
            <h2 className="sec-title sm">Pré-requisitos</h2>
            <ul className="req-list">
              {event.requirements.map((r, i) => (
                <li key={i}>
                  <Icon name="CircleCheck" size={18} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="sec">
          <h2 className="sec-title sm">Certificado</h2>
          {event.cert_signer_name || event.cert_issuer ? (
            <>
              <CertificatePreview event={event} participant={isStudent ? profile.name : 'Nome do participante'} compact />
              {event.cert_delivery && (
                <p className="muted small">
                  <Icon name="Send" size={14} /> {event.cert_delivery}
                </p>
              )}
              {(() => {
                const miss = eventCertChecks(event).filter((c) => !c.ok);
                return miss.length ? <p className="alert alert-warn">O certificado ainda não informa: {miss.map((m) => m.label.toLowerCase()).join(', ')}.</p> : null;
              })()}
            </>
          ) : (
            <p className="alert alert-warn">
              <Icon name="ShieldAlert" size={18} />
              <span>O organizador ainda não informou quem emite e quem assina o certificado. Confirme antes de contar com as horas.</span>
            </p>
          )}
        </section>

        <PresenceCard event={event} />

        {event.description && (
          <section className="sec">
            <h2 className="sec-title sm">Sobre</h2>
            <p className="desc">{event.description}</p>
          </section>
        )}

        {isOwner && (
          <div className="owner-box">
            <div className="stat-row">
              <div>
                <b>{event.views || 0}</b>
                <span>visualizações</span>
              </div>
              <div>
                <b>{event.link_clicks || 0}</b>
                <span>cliques na inscrição</span>
              </div>
              <div>
                <b>{c.going}</b>
                <span>vão</span>
              </div>
            </div>
            {event.reject_reason && event.status === 'rejected' && <p className="alert alert-error">Motivo: {event.reject_reason}</p>}
            <Link to={`/evento/${event.id}/editar`} className="btn btn-ghost btn-block">
              <Icon name="Pencil" size={18} /> <span>Editar evento</span>
            </Link>
            {hasGeo(event) && (
              <Link to={`/evento/${event.id}/presenca`} className="btn btn-ghost btn-block">
                <Icon name="ClipboardList" size={18} /> <span>Lista de presença</span>
              </Link>
            )}
          </div>
        )}
        {!isOwner && hasGeo(event) && coordinatesEvent(profile, event) && (
          <Link to={`/evento/${event.id}/presenca`} className="btn btn-ghost btn-block">
            <Icon name="ClipboardList" size={18} /> <span>Lista de presença</span>
          </Link>
        )}
      </div>

      <div className="action-bar">
        {!user ? (
          <Link to="/" className="btn btn-primary btn-block btn-lg">
            Criar conta para participar
          </Link>
        ) : isStudent ? (
          <>
            {past ? (
              <Button block size="lg" icon="ShieldPlus" onClick={() => setAddOpen(true)}>
                Já participei: guardar certificado
              </Button>
            ) : (
              <>
                <Button variant={going ? 'dark' : 'ghost'} icon={going ? 'CircleCheck' : 'CirclePlus'} onClick={() => toggle(event.id, 'going')}>
                  {going ? 'Vou!' : 'Vou'}
                </Button>
                {href ? (
                  <Button block icon="ExternalLink" onClick={openLink}>
                    Inscrever-se
                  </Button>
                ) : (
                  <Button block variant="soft" icon="ShieldPlus" onClick={() => setAddOpen(true)}>
                    Já tenho o certificado
                  </Button>
                )}
              </>
            )}
          </>
        ) : href ? (
          <Button block icon="ExternalLink" onClick={openLink}>
            Abrir link de inscrição
          </Button>
        ) : null}
      </div>
      {isStudent && !past && href && (
        <button className="link-btn center-link" onClick={() => setAddOpen(true)}>
          Já participou? Guarde o certificado no cofre
        </button>
      )}

      <CertificateForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        initial={{ title: event.title, hours: Number(event.hours) > 0 ? event.hours : '', type_key: typeKey || '', issuer: event.organizer_name || '', issued_on: [ymd(event.ends_at || event.starts_at), ymd(new Date())].sort()[0], event_id: event.id }}
      />
    </div>
  );
}

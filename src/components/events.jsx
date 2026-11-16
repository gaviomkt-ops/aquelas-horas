import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, EventCover, Badge } from './ui.jsx';
import { EVENT_CATEGORIES, eventCategory, typeForEvent } from '../lib/rules.js';
import { dateRangeLabel, timeLabel, priceLabel, isLive, isNew, isFree } from '../lib/format.js';
import { roomInType } from '../lib/progress.js';
import { useStore } from '../lib/store.jsx';
import { isStudentLike } from '../lib/roles.js';

// Quanto o evento rende para o aluno logado: "+12h" ou "teto atingido"
export function useHoursFit(event) {
  const { profile, progress } = useStore();
  if (!(Number(event.hours) > 0)) return { label: 'Horas a confirmar', tone: 'neutral', note: 'Carga horária não divulgada' };
  if (!profile || !isStudentLike(profile) || !progress) return { label: `+${fmt(event.hours)}`, tone: 'brand' };
  const key = typeForEvent(profile, event.category);
  if (!key) return { label: `${fmt(event.hours)}`, tone: 'neutral', note: 'Categoria fora da tabela do seu curso' };
  const room = roomInType(progress, key);
  if (room <= 0) return { label: 'Teto atingido', tone: 'muted', note: 'Você já completou essa categoria' };
  const counts = Math.min(Number(event.hours) || 0, room);
  return { label: `+${fmt(counts)}`, tone: 'brand', room, typeKey: key };
}
function fmt(h) {
  return `${String(Math.round(Number(h) * 10) / 10).replace('.', ',')}h`;
}

export function EventCard({ event }) {
  const fit = useHoursFit(event);
  const live = isLive(event);
  return (
    <Link to={`/evento/${event.id}`} className="ev-card">
      <div className="ev-card-media">
        <EventCover event={event} />
        {live ? (
          <span className="pill-live">
            <i /> Agora
          </span>
        ) : isNew(event) ? (
          <span className="pill-new">Novo</span>
        ) : null}
        {event.is_example && <span className="pill-example">Exemplo</span>}
      </div>
      <div className="ev-card-body">
        <h3>{event.title}</h3>
        <div className="ev-meta">
          <Icon name="MapPin" size={14} className="ic-brand" />
          <span>{event.location || 'Local a definir'}</span>
        </div>
        <div className="ev-meta">
          <Icon name="Calendar" size={14} />
          <span>
            {dateRangeLabel(event)} · {timeLabel(event.starts_at)}
          </span>
        </div>
        <div className="ev-card-foot">
          <span className={`hours-chip hours-${fit.tone}`}>
            <Icon name="Clock3" size={13} /> {fit.label}
          </span>
          <span className={`price ${isFree(event) ? 'price-free' : ''}`}>{event.capacity ? `${event.capacity} vagas · ` : ''}{priceLabel(event.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export function BoostCarousel({ events }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (events.length < 2) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const next = (idx + 1) % events.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 5000);
    return () => clearInterval(t);
  }, [idx, events.length]);
  if (!events.length) return null;
  return (
    <div className="boost">
      <div
        className="boost-track"
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIdx(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {events.map((ev) => (
          <Link key={ev.id} to={`/evento/${ev.id}`} className="boost-slide">
            <EventCover event={ev} />
            <div className="boost-shade" />
            <div className="boost-text">
              <span className="boost-tag">
                <Icon name="Flame" size={13} /> Em alta{ev.is_example ? ' · exemplo' : ''}
              </span>
              <h3>{ev.title}</h3>
              <p>
                <b>{dateRangeLabel(ev)}</b> · {ev.location}
                {Number(ev.hours) > 0 && (
                  <>
                    {' '}
                    · <b>+{fmt(ev.hours)}</b>
                  </>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {events.length > 1 && (
        <div className="dots">
          {events.map((ev, i) => (
            <button
              key={ev.id}
              className={i === idx ? 'on' : ''}
              aria-label={`Destaque ${i + 1}`}
              onClick={() => ref.current?.scrollTo({ left: i * ref.current.clientWidth, behavior: 'smooth' })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryStrip({ value, onChange }) {
  return (
    <div className="cat-strip">
      {EVENT_CATEGORIES.map((c) => (
        <button key={c.id} type="button" className={`cat ${value === c.id ? 'cat-on' : ''}`} onClick={() => onChange(value === c.id ? null : c.id)} aria-pressed={value === c.id}>
          <span className="cat-ic" style={{ color: c.color }}>
            <Icon name={c.icon} size={22} />
          </span>
          <span className="cat-label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}

export function CategoryBadge({ id }) {
  const c = eventCategory(id);
  return (
    <Badge tone="neutral" icon={c.icon}>
      {c.label}
    </Badge>
  );
}

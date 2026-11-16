import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { eventCategory } from '../lib/rules.js';
import { CategoryStrip, EventCard } from '../components/events.jsx';
import { Chip, Empty, Icon, Logo } from '../components/ui.jsx';
import { upcoming } from './Home.jsx';
import { isFree } from '../lib/format.js';

function norm(s = '') {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export default function Explore({ guest }) {
  const { events } = useStore();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [free, setFree] = useState(false);
  const [sort, setSort] = useState('data');
  const cat = params.get('cat');

  const list = useMemo(() => {
    let l = upcoming(events);
    if (cat) l = l.filter((e) => e.category === cat);
    if (free) l = l.filter(isFree);
    if (q.trim()) {
      const n = norm(q);
      l = l.filter((e) => norm(`${e.title} ${e.description} ${e.location} ${e.organizer_name} ${eventCategory(e.category).label}`).includes(n));
    }
    if (sort === 'horas') l = [...l].sort((a, b) => Number(b.hours) - Number(a.hours));
    return l;
  }, [events, cat, free, q, sort]);

  return (
    <div className="page">
      {guest && (
        <div className="guest-top">
          <Logo height={44} />
          <Link to="/" className="btn btn-primary btn-sm">
            Criar conta grátis
          </Link>
        </div>
      )}
      <header className="top">
        <div>
          <span className="eyebrow">Descobrir</span>
          <h1 className="top-title">Eventos que valem horas</h1>
        </div>
        {!guest && (
          <Link to="/evento/novo" className="btn btn-soft btn-sm">
            <Icon name="CalendarPlus" size={16} /> <span>Sugerir evento</span>
          </Link>
        )}
      </header>
      <div className="search">
        <Icon name="Search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar palestra, curso, local…" aria-label="Buscar eventos" />
        {q && (
          <button className="icon-btn" onClick={() => setQ('')} aria-label="Limpar busca">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      <CategoryStrip
        value={cat}
        onChange={(c) => {
          if (c) setParams({ cat: c });
          else setParams({});
        }}
      />
      <div className="chips">
        <Chip active={sort === 'data'} icon="CalendarClock" onClick={() => setSort('data')}>
          Mais próximos
        </Chip>
        <Chip active={sort === 'horas'} icon="Clock3" onClick={() => setSort('horas')}>
          Mais horas
        </Chip>
        <Chip active={free} icon="Tag" onClick={() => setFree(!free)}>
          Gratuitos
        </Chip>
      </div>
      <p className="count-line">
        {list.length} {list.length === 1 ? 'evento' : 'eventos'}
        {cat ? ` em ${eventCategory(cat).label}` : ''}
      </p>
      <div className="ev-list">
        {list.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
      {!list.length && <Empty icon="SearchX" title="Nada encontrado" text="Tente outra palavra ou tire os filtros." />}
    </div>
  );
}

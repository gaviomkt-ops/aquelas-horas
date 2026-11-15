import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getInstitution, typeForEvent } from '../lib/rules.js';
import { isPast, isLive, ymd, todayYmd, isFree } from '../lib/format.js';
import { roomInType, formatHours } from '../lib/progress.js';
import { BoostCarousel, CategoryStrip, EventCard } from '../components/events.jsx';
import { Chip, Empty, Icon, Ring } from '../components/ui.jsx';
import { InstallButton } from '../components/InstallApp.jsx';

export function upcoming(events) {
  return events
    .filter((e) => !isPast(e))
    .sort((a, b) => {
      const la = isLive(a) ? 0 : 1;
      const lb = isLive(b) ? 0 : 1;
      return la - lb || new Date(a.starts_at) - new Date(b.starts_at);
    });
}

export function boosted(events) {
  const now = new Date();
  return upcoming(events).filter((e) => e.boost_status === 'active' && (!e.boost_until || new Date(e.boost_until) > now));
}

export default function Home() {
  const { profile, events, progress } = useStore();
  const nav = useNavigate();
  const [filter, setFilter] = useState('todos');
  const [day, setDay] = useState(todayYmd());
  const inst = getInstitution(profile.institution_id);
  const list = useMemo(() => upcoming(events), [events]);
  const hot = useMemo(() => boosted(events), [events]);

  const shown = useMemo(() => {
    let l = list;
    if (filter === 'gratis') l = l.filter(isFree);
    if (filter === 'meu') l = l.filter((e) => (!e.courses?.length || e.courses.includes(profile.course_id)) && worth(e));
    if (filter === 'dia') l = l.filter((e) => ymd(e.starts_at) <= day && ymd(e.ends_at || e.starts_at) >= day);
    return l;
    function worth(e) {
      const key = typeForEvent(profile, e.category);
      return key && roomInType(progress, key) > 0;
    }
  }, [list, filter, day, profile, progress]);

  const first = profile.name?.split(' ')[0];
  const next7 = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Explorar em</span>
          <h1 className="top-title">{inst.city || 'sua cidade'}</h1>
        </div>
        <Link to="/perfil" className="icon-btn icon-btn-soft" aria-label="Perfil">
          <Icon name="UserRound" />
        </Link>
      </header>

      <Link to="/cofre" className="progress-card">
        <Ring pct={progress.pct}>
          <b>{progress.pct}%</b>
        </Ring>
        <div className="progress-text">
          <span className="eyebrow eyebrow-light">Olá, {first}</span>
          {progress.done ? (
            <h2>Meta batida! 🎉</h2>
          ) : (
            <h2>
              Faltam <span className="hl">{formatHours(progress.remaining)}</span>
            </h2>
          )}
          <p>
            {formatHours(progress.counted)} de {formatHours(progress.goal)} · {progress.certificates} {progress.certificates === 1 ? 'certificado' : 'certificados'}
          </p>
          <span className="progress-cta">
            Abrir cofre <Icon name="ArrowRight" size={16} />
          </span>
        </div>
      </Link>

      <InstallButton variant="card" />

      {hot.length > 0 && (
        <section className="sec">
          <h2 className="sec-title">Em alta</h2>
          <BoostCarousel events={hot} />
        </section>
      )}

      <section className="sec">
        <h2 className="sec-title">Explore por categoria</h2>
        <CategoryStrip value={null} onChange={(c) => nav(`/explorar?cat=${c}`)} />
      </section>

      <section className="sec">
        <h2 className="sec-title">Próximos eventos</h2>
        <div className="chips">
          <Chip active={filter === 'todos'} icon="LayoutGrid" onClick={() => setFilter('todos')}>
            Todos
          </Chip>
          <Chip active={filter === 'meu'} icon="Target" onClick={() => setFilter('meu')}>
            Contam pro meu curso
          </Chip>
          <Chip active={filter === 'dia'} icon="Calendar" onClick={() => setFilter('dia')}>
            Calendário
          </Chip>
          <Chip active={filter === 'gratis'} icon="Tag" onClick={() => setFilter('gratis')}>
            Gratuitos
          </Chip>
        </div>
        {filter === 'dia' && (
          <div className="days">
            {next7.map((d) => {
              const v = ymd(d);
              return (
                <button key={v} type="button" className={`day ${v === day ? 'day-on' : ''}`} onClick={() => setDay(v)}>
                  <span>{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                  <b>{d.getDate()}</b>
                </button>
              );
            })}
          </div>
        )}
        <div className="ev-list">
          {shown.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
        {!shown.length && (
          <Empty icon="CalendarX2" title="Nenhum evento aqui" text={filter === 'meu' ? 'Nenhum evento novo encaixa nas categorias onde você ainda tem espaço.' : 'Ainda não há eventos publicados para esse filtro.'} />
        )}
      </section>
    </div>
  );
}

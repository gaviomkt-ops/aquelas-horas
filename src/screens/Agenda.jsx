import { useMemo, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { isPast, ymd, fullDate } from '../lib/format.js';
import { EventCard } from '../components/events.jsx';
import { Empty, Segmented } from '../components/ui.jsx';

export default function Agenda() {
  const { events, interactions } = useStore();
  const [tab, setTab] = useState('going');

  const { going, saved, past } = useMemo(() => {
    const byId = Object.fromEntries(events.map((e) => [e.id, e]));
    const pick = (kind) => interactions.filter((i) => i.kind === kind).map((i) => byId[i.event_id]).filter(Boolean);
    const g = pick('going');
    const s = pick('saved');
    const sortAsc = (a, b) => new Date(a.starts_at) - new Date(b.starts_at);
    return {
      going: g.filter((e) => !isPast(e)).sort(sortAsc),
      saved: s.filter((e) => !isPast(e)).sort(sortAsc),
      past: [...new Map([...g, ...s].filter(isPast).map((e) => [e.id, e])).values()].sort((a, b) => sortAsc(b, a)),
    };
  }, [events, interactions]);

  const list = tab === 'going' ? going : tab === 'saved' ? saved : past;
  const groups = useMemo(() => {
    const m = new Map();
    for (const e of list) {
      const k = ymd(e.starts_at);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(e);
    }
    return [...m.entries()];
  }, [list]);

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Agenda</span>
          <h1 className="top-title">Meus eventos</h1>
        </div>
      </header>
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'going', label: 'Vou', count: going.length },
          { value: 'saved', label: 'Salvos', count: saved.length },
          { value: 'past', label: 'Já foram', count: past.length },
        ]}
      />
      {tab === 'past' && past.length > 0 && <p className="muted small">Participou? Abra o evento e guarde o certificado no cofre.</p>}
      {groups.map(([day, evs]) => (
        <section key={day} className="sec">
          <h2 className="day-head">{fullDate(evs[0].starts_at)}</h2>
          <div className="ev-list">
            {evs.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      ))}
      {!list.length && (
        <Empty
          icon="CalendarHeart"
          title={tab === 'going' ? 'Nenhum evento marcado' : tab === 'saved' ? 'Nada salvo ainda' : 'Nenhum evento passado'}
          text="Marque “Vou” ou salve eventos na vitrine para vê-los aqui."
        />
      )}
    </div>
  );
}

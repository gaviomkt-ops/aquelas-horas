import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { getCourse, getInstitution } from '../lib/rules.js';
import { Button, Empty, Icon, Segmented } from '../components/ui.jsx';
import { EventRow } from './OrgHome.jsx';

// Coordenação de curso: aprova (ou recusa) os eventos sugeridos para o seu curso.
// O evento só vai para a vitrine com a aprovação da coordenação E do admin.
export default function Coordenacao() {
  const { api, profile, counts, notify, loadEvents } = useStore();
  const [tab, setTab] = useState('pendentes');
  const [events, setEvents] = useState(null);

  const load = useCallback(async () => {
    try {
      setEvents(await api.listCoordQueue());
    } catch (e) {
      notify(e.message, 'error');
      setEvents([]);
    }
  }, [api, notify]);
  useEffect(() => {
    load();
  }, [load]);

  const pendentes = useMemo(() => (events || []).filter((e) => e.status === 'pending' && !e.coord_approved_at), [events]);
  const aguardandoAdmin = useMemo(() => (events || []).filter((e) => e.status === 'pending' && e.coord_approved_at), [events]);
  const decididos = useMemo(() => (events || []).filter((e) => e.status !== 'pending'), [events]);

  async function run(fn, msg) {
    try {
      const r = await fn();
      notify(typeof msg === 'function' ? msg(r) : msg);
      await Promise.all([load(), loadEvents()]);
    } catch (e) {
      notify(e.message, 'error');
    }
  }
  const approve = (ev) => run(() => api.approveEvent(ev.id), (st) => (st === 'approved' ? 'Aprovado e publicado na vitrine.' : 'Aprovado. Falta a aprovação do admin.'));
  const reject = (ev) => {
    const reason = window.prompt('Motivo da recusa (quem enviou vai ver):', '');
    if (reason === null) return;
    run(() => api.rejectEvent(ev.id, reason), 'Evento recusado.');
  };

  const inst = getInstitution(profile.institution_id);
  const curso = profile.course_id ? getCourse(profile.institution_id, profile.course_id)?.name : 'todos os cursos';
  const list = tab === 'pendentes' ? pendentes : tab === 'admin' ? aguardandoAdmin : decididos;

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">
            Coordenação · {inst.name} · {curso}
          </span>
          <h1 className="top-title">Aprovar eventos</h1>
        </div>
        <button className="icon-btn icon-btn-soft" onClick={load} aria-label="Atualizar">
          <Icon name="RefreshCw" />
        </button>
      </header>

      <div className="tip">
        <Icon name="ShieldCheck" size={20} />
        <p>
          Confira se o evento vale horas para o curso: carga horária, pré-requisitos e quem assina o certificado. O evento só vai para a vitrine com a sua aprovação <b>e</b> a do admin.
        </p>
      </div>

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'pendentes', label: 'Para aprovar', count: pendentes.length || null },
          { value: 'admin', label: 'Falta admin', count: aguardandoAdmin.length || null },
          { value: 'decididos', label: 'Decididos' },
        ]}
      />

      {events === null && (
        <div className="center-pad">
          <span className="spinner spinner-dark" />
        </div>
      )}
      {events && !list.length && (
        <Empty
          icon="ListChecks"
          title={tab === 'pendentes' ? 'Nada para aprovar' : tab === 'admin' ? 'Nenhum evento esperando o admin' : 'Nenhum evento decidido ainda'}
          text={tab === 'pendentes' ? 'Quando alguém sugerir um evento para o seu curso, ele aparece aqui.' : null}
        />
      )}
      <div className="org-list">
        {list.map((ev) => (
          <EventRow
            key={ev.id}
            event={ev}
            counts={counts}
            actions={
              tab === 'pendentes' ? (
                <div className="row-gap">
                  <Button size="sm" icon="Check" onClick={() => approve(ev)}>
                    Aprovar
                  </Button>
                  <Button size="sm" variant="ghost" icon="X" onClick={() => reject(ev)}>
                    Recusar
                  </Button>
                </div>
              ) : ev.status === 'rejected' && ev.reject_reason ? null : tab === 'decididos' && ev.status === 'approved' ? (
                <div className="row-gap">
                  <Button size="sm" variant="ghost" icon="EyeOff" onClick={() => reject(ev)}>
                    Tirar do ar
                  </Button>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </div>
  );
}

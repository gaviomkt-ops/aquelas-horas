import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { Button, Empty, Icon } from '../components/ui.jsx';
import { EventRow } from './OrgHome.jsx';

// Eventos que a pessoa sugeriu e em que pé está a aprovação (admin + coordenação do curso).
export default function MyEvents() {
  const { api, counts, notify, loadEvents } = useStore();
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

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Eventos que enviei</span>
          <h1 className="top-title">Minhas sugestões</h1>
        </div>
        <Link to="/evento/novo" className="btn btn-primary btn-sm">
          <Icon name="Plus" size={16} /> <span>Sugerir</span>
        </Link>
      </header>

      <div className="tip">
        <Icon name="ListChecks" size={20} />
        <p>
          Todo evento enviado passa por <b>duas aprovações</b>: a equipe do app (admin) e a <b>coordenação do curso</b>. Ele só aparece na vitrine depois das duas. Se o curso ainda não tem coordenação no app, a aprovação do admin basta.
        </p>
      </div>

      {mine === null && (
        <div className="center-pad">
          <span className="spinner spinner-dark" />
        </div>
      )}
      {mine?.length === 0 && (
        <Empty icon="CalendarPlus" title="Você ainda não sugeriu eventos" text="Conhece uma palestra, curso ou oficina que vale horas? Envie com os pré-requisitos e o certificado.">
          <Link to="/evento/novo" className="btn btn-primary">
            Sugerir evento
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
                <Button size="sm" variant="ghost" icon="Trash2" onClick={() => remove(ev)} aria-label="Apagar" />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

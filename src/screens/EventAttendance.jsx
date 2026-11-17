import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { csvPresenca, durationLabel, horaLabel, permanenceMinutes, presenceStatus } from '../lib/presence.js';
import { hasGeo } from '../lib/presence.js';
import { Badge, Button, Empty, Icon } from '../components/ui.jsx';
import { AttendancePhoto } from '../components/Presence.jsx';

// Lista de presença do evento: para quem organiza, a coordenação do curso e o admin.
// O banco confere quem pode ver (função event_attendance); aqui só monta a tela.
export default function EventAttendance() {
  const { id } = useParams();
  const { api, notify } = useStore();
  const [event, setEvent] = useState(null);
  const [rows, setRows] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.getEvent(id), api.eventAttendance(id)])
      .then(([ev, list]) => {
        if (!alive) return;
        setEvent(ev);
        setRows(list || []);
      })
      .catch((e) => {
        if (!alive) return;
        setErro(e.message);
        setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [api, id]);

  const resumo = useMemo(() => {
    const r = rows || [];
    return {
      total: r.length,
      comFoto: r.filter((a) => a.photo_path).length,
      automaticos: r.filter((a) => a.checkin_auto).length,
      saidas: r.filter((a) => a.checkout_at).length,
    };
  }, [rows]);

  function baixar() {
    try {
      const slug = (event?.title || 'evento')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40);
      const url = URL.createObjectURL(new Blob([csvPresenca((rows || []).map((r) => ({ ...r, evento_titulo: event?.title })))], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `presenca-${slug}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      notify(e.message, 'error');
    }
  }

  return (
    <div className="page">
      <header className="top">
        <div>
          <Link to={`/evento/${id}`} className="eyebrow inline-link">
            <Icon name="ChevronLeft" size={14} /> Voltar ao evento
          </Link>
          <h1 className="top-title">Lista de presença</h1>
          {event && <p className="muted small">{event.title}</p>}
        </div>
      </header>

      <div className="tip">
        <Icon name="ShieldCheck" size={20} />
        <p>
          Presença comprovada = check-in pelo GPS dentro do local, no horário do evento, <b>e</b> foto de evidência tirada lá. Quem tem só o check-in aparece como “falta a foto”. Esta lista tem dados
          pessoais: não compartilhe fora de quem organiza o evento.
        </p>
      </div>

      {event && !hasGeo(event) && (
        <p className="alert alert-warn">
          <Icon name="TriangleAlert" size={18} />
          <span>Este evento não tem local com GPS cadastrado, então o check-in automático não está ativo. Edite o evento e informe o endereço.</span>
        </p>
      )}
      {erro && <p className="alert alert-error">{erro}</p>}

      <div className="kpis">
        <div>
          <b>{resumo.total}</b>
          <span>check-ins</span>
        </div>
        <div>
          <b>{resumo.comFoto}</b>
          <span>com foto</span>
        </div>
        <div>
          <b>{resumo.automaticos}</b>
          <span>automáticos</span>
        </div>
        <div>
          <b>{resumo.saidas}</b>
          <span>saídas</span>
        </div>
      </div>

      {rows && rows.length > 0 && (
        <Button variant="soft" size="sm" icon="Download" onClick={baixar}>
          Baixar planilha (CSV)
        </Button>
      )}

      {rows === null && (
        <div className="center-pad">
          <span className="spinner spinner-dark" />
        </div>
      )}

      {rows && !rows.length && !erro && (
        <Empty icon="ClipboardList" title="Ninguém fez check-in ainda" text="O check-in abre 30 minutos antes do início, pelo GPS, quando a pessoa está no local." />
      )}

      <div className="presence-list">
        {(rows || []).map((a) => {
          const st = presenceStatus(a);
          return (
            <article key={a.id} className="presence-row">
              {a.photo_path ? (
                <AttendancePhoto path={a.photo_path} alt={`Foto de ${a.name || 'participante'}`} className="presence-photo" />
              ) : (
                <span className="presence-nophoto" title="Sem foto de evidência">
                  <Icon name="Camera" size={22} />
                </span>
              )}
              <div className="presence-row-body">
                <b>{a.name || 'Participante'}</b>
                <span className="muted">
                  {a.email || ''} {a.course_id ? `· ${a.course_id}` : ''}
                </span>
                <span>
                  Entrada {horaLabel(a.checkin_at)} {a.checkin_auto ? '(automática)' : '(manual)'} · a {a.checkin_distance_m} m (± {a.checkin_accuracy_m} m)
                </span>
                <span>
                  {a.checkout_at ? `Saída ${horaLabel(a.checkout_at)}` : `Último sinal ${horaLabel(a.last_seen_at || a.checkin_at)}`} · permanência {durationLabel(permanenceMinutes(a))}
                </span>
                <span className="row-gap wrap">
                  <Badge tone={st.tone}>{st.label}</Badge>
                  <span className="mono small">{a.receipt_code}</span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

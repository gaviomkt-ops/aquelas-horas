// Presença no evento, estilo "ponto móvel":
// 1) check-in automático: com o app aberto no local e no horário do evento, o GPS registra a entrada;
// 2) foto de evidência tirada na hora pela câmera;
// 3) saída: o app renova o sinal enquanto está aberto no local, e a pessoa pode registrar a saída.
// A posição é comparada com o local aqui no celular; só vai ao servidor quando a pessoa está no evento.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { isStudentLike } from '../lib/roles.js';
import { geoPermission, getPosition } from '../lib/geolocate.js';
import { checkinWindow, durationLabel, hasGeo, horaLabel, permanenceMinutes, positionCheck, presenceStatus, windowState } from '../lib/presence.js';
import { Badge, Button, Icon } from './ui.jsx';

const PING_EVERY_MS = 3 * 60 * 1000;

// eventos com check-in por GPS cuja janela está aberta agora (30 min antes até 30 min depois)
function useLiveGeoEvents() {
  const { events } = useStore();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => events.filter((e) => hasGeo(e) && windowState(e) === 'aberto'), [events, tick]);
}

// Roda no app inteiro para quem é aluno: se a localização já está liberada, confere em silêncio
// ao abrir o app, ao voltar para ele e a cada 3 minutos enquanto está aberto.
export function useAutoCheckin() {
  const { profile, attendanceFor, checkIn, notify } = useStore();
  const live = useLiveGeoEvents();
  const busy = useRef(false);
  const last = useRef(0);
  const state = useRef({ live, attendanceFor });
  state.current = { live, attendanceFor };
  const aluno = isStudentLike(profile);

  const run = useCallback(
    async (force = false) => {
      const { live: evs, attendanceFor: attFor } = state.current;
      if (!aluno || !evs.length || busy.current || document.visibilityState === 'hidden') return;
      if (!force && Date.now() - last.current < 60000) return;
      if ((await geoPermission()) !== 'granted') return; // sem permissão, o aviso no topo pede para ativar
      busy.current = true;
      last.current = Date.now();
      try {
        const pos = await getPosition({ timeout: 15000, maximumAge: 60000 });
        for (const ev of evs) {
          if (!positionCheck(ev, pos).inside) continue; // longe do evento: nada sai do celular
          const before = attFor(ev.id);
          try {
            await checkIn(ev, 'auto', pos);
            if (!before) notify(`Presença registrada em “${ev.title}”. Agora tire a foto de evidência.`);
          } catch {
            /* fora da janela ou GPS ruim: tenta de novo no próximo ciclo */
          }
        }
      } catch {
        /* GPS indisponível agora */
      } finally {
        busy.current = false;
      }
    },
    [aluno, checkIn, notify],
  );

  useEffect(() => {
    if (!aluno || !live.length) return undefined;
    run(true);
    const t = setInterval(() => run(), PING_EVERY_MS);
    const onVis = () => document.visibilityState === 'visible' && run(true);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [aluno, live.length, run]);
}

function dismissed(id) {
  try {
    return sessionStorage.getItem(`ah_presenca_ok_${id}`) === '1';
  } catch {
    return false;
  }
}
function dismiss(id) {
  try {
    sessionStorage.setItem(`ah_presenca_ok_${id}`, '1');
  } catch {
    /* sem armazenamento: só some até recarregar */
  }
}

// Aviso no topo durante o evento: registrar presença ou tirar a foto que falta.
export function PresenceBanner() {
  const { profile, attendanceFor } = useStore();
  const live = useLiveGeoEvents();
  const [, force] = useState(0);
  if (!isStudentLike(profile)) return null;
  const ev = live.find((e) => !dismissed(e.id) && !(attendanceFor(e.id)?.photo_path));
  if (!ev) return null;
  const att = attendanceFor(ev.id);
  return (
    <div className="presence-banner" role="status">
      <Icon name={att ? 'Camera' : 'MapPinCheck'} size={20} />
      <Link to={`/evento/${ev.id}#presenca`}>
        {att ? (
          <>
            <b>Check-in feito às {horaLabel(att.checkin_at)}</b>
            <span>Falta a foto de evidência em “{ev.title}”.</span>
          </>
        ) : (
          <>
            <b>Acontecendo agora: {ev.title}</b>
            <span>Está no local? Toque para registrar sua presença.</span>
          </>
        )}
      </Link>
      <button
        className="icon-btn"
        aria-label="Esconder aviso"
        onClick={() => {
          dismiss(ev.id);
          force((x) => x + 1);
        }}
      >
        <Icon name="X" size={16} />
      </button>
    </div>
  );
}

export function AttendancePhoto({ path, alt = 'Foto de evidência', className = 'presence-photo' }) {
  const { api } = useStore();
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    let created = null;
    if (path)
      api
        .attendancePhotoUrl(path)
        .then((u) => {
          if (!alive) return;
          if (u?.startsWith('blob:')) created = u;
          setUrl(u);
        })
        .catch(() => {});
    return () => {
      alive = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [api, path]);
  if (!path) return null;
  if (!url) return <span className={`${className} is-loading`} />;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      <img src={url} alt={alt} />
    </a>
  );
}

// Cartão "Presença no evento" na página do evento (aluno).
export function PresenceCard({ event }) {
  const { profile, attendanceFor, checkIn, sendPresencePhoto, notify } = useStore();
  const [busy, setBusy] = useState(null);
  const [perm, setPerm] = useState('unknown');
  const [, setTick] = useState(0);
  const att = attendanceFor(event.id);
  const st = windowState(event);

  useEffect(() => {
    geoPermission().then(setPerm);
    const t = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (window.location.hash.endsWith('#presenca')) document.getElementById('presenca')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!isStudentLike(profile) || !hasGeo(event)) return null;

  async function go(kind, fn, okMsg) {
    setBusy(kind);
    try {
      const r = await fn();
      if (okMsg) notify(typeof okMsg === 'function' ? okMsg(r) : okMsg);
      setPerm(await geoPermission());
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(null);
    }
  }
  const registrar = () => go('in', () => checkIn(event, 'manual'), att ? 'Presença confirmada no local.' : 'Presença registrada! Agora tire a foto de evidência.');
  const sair = () => go('out', () => checkIn(event, 'checkout'), (r) => `Saída registrada às ${horaLabel(r.checkout_at)}.`);
  const foto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) go('foto', () => sendPresencePhoto(event, file), 'Foto de evidência guardada.');
  };

  const { opens } = checkinWindow(event);
  const status = presenceStatus(att);
  const minutos = permanenceMinutes(att);

  return (
    <section className="sec presence-card" id="presenca">
      <div className="row-between">
        <h2 className="sec-title sm">Presença no evento</h2>
        {att && <Badge tone={status.tone}>{status.label}</Badge>}
      </div>

      {st === 'antes' && (
        <p className="muted">
          O check-in abre às <b>{horaLabel(opens)}</b> de {opens.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, 30 minutos antes do início. No local, abra o app: a presença é
          registrada sozinha pelo GPS (até {event.geo_radius_m || 200} m do local). Depois, tire uma foto do evento como evidência.
        </p>
      )}

      {st === 'aberto' && !att && (
        <>
          <p className="muted">
            Chegou? Registre a presença pelo GPS (até {event.geo_radius_m || 200} m do local). {perm === 'granted' ? 'Com o app aberto, isso acontece sozinho.' : 'Ao liberar a localização, das próximas vezes o check-in é automático.'}
          </p>
          <Button block icon="MapPinCheck" onClick={registrar} disabled={!!busy}>
            {busy === 'in' ? 'Conferindo sua localização…' : 'Registrar presença agora'}
          </Button>
          {perm === 'denied' && <p className="alert alert-warn">A localização está bloqueada para este site. Libere nas configurações do navegador (Ajustes &gt; Safari &gt; Localização, no iPhone).</p>}
        </>
      )}

      {att && (
        <>
          <ul className="presence-facts">
            <li>
              <Icon name="LocateFixed" size={16} />
              <span>
                Entrada <b>{horaLabel(att.checkin_at)}</b> {att.checkin_auto ? '(automática)' : ''} · a {att.checkin_distance_m} m do local (± {att.checkin_accuracy_m} m)
              </span>
            </li>
            <li>
              <Icon name={att.checkout_at ? 'DoorOpen' : 'Clock3'} size={16} />
              <span>
                {att.checkout_at ? (
                  <>
                    Saída <b>{horaLabel(att.checkout_at)}</b>
                  </>
                ) : (
                  <>
                    Último sinal no local <b>{horaLabel(att.last_seen_at || att.checkin_at)}</b>
                  </>
                )}{' '}
                · permanência {durationLabel(minutos)}
              </span>
            </li>
            <li>
              <Icon name="BadgeCheck" size={16} />
              <span>
                Comprovante <b className="mono">{att.receipt_code}</b>
              </span>
            </li>
          </ul>

          {att.photo_path ? (
            <div className="presence-photo-row">
              <AttendancePhoto path={att.photo_path} />
              <p className="small muted">Foto de evidência tirada às {horaLabel(att.photo_at)}.</p>
            </div>
          ) : st === 'aberto' ? (
            <label className={`btn btn-primary btn-block ${busy ? 'is-disabled' : ''}`}>
              <Icon name="Camera" size={18} /> <span>{busy === 'foto' ? 'Enviando a foto…' : 'Tirar foto de evidência'}</span>
              <input type="file" accept="image/*" capture="environment" onChange={foto} disabled={!!busy} hidden />
            </label>
          ) : (
            <p className="alert alert-warn">A foto de evidência não foi enviada durante o evento.</p>
          )}

          {st === 'aberto' && (
            <div className="row-gap wrap">
              <Button variant="ghost" size="sm" icon="RefreshCw" onClick={registrar} disabled={!!busy}>
                Confirmar que estou aqui
              </Button>
              {!att.checkout_at && (
                <Button variant="ghost" size="sm" icon="DoorOpen" onClick={sair} disabled={!!busy}>
                  Registrar saída
                </Button>
              )}
            </div>
          )}
          {st === 'aberto' && !att.checkout_at && <p className="small muted">Deixe o app aberto de vez em quando durante o evento: cada abertura no local renova o sinal. Ao ir embora, toque em “Registrar saída”.</p>}
        </>
      )}

      {st === 'encerrado' && !att && <p className="muted">O check-in deste evento fechou sem presença registrada pelo app.</p>}

      <p className="small muted presence-privacy">
        <Icon name="Lock" size={13} /> O app não guarda sua localização, só a distância até o local. Nome, curso, horários e a foto ficam visíveis para quem organiza o evento, a coordenação do curso e a
        secretaria (se você autorizou), para conferir a presença e emitir o certificado.
      </p>
    </section>
  );
}

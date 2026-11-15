import { useState } from 'react';
import { Icon } from './ui.jsx';
import { CERT_REQUIREMENTS } from '../lib/certParse.js';
import { formatHours } from '../lib/progress.js';

export const SHORT_LABEL = {
  name: 'seu nome',
  activity: 'nome da atividade',
  participation: 'tipo de participação',
  period: 'data',
  issuer: 'instituição',
  hours: 'carga horária',
  signer: 'assinatura e cargo',
  verification: 'código de verificação',
};

export function listPt(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

// Checklist do certificado do aluno. `checks` = null mostra só a lista do que conferir.
export function RequirementsCard({ checks, ielusc }) {
  const required = (checks || []).filter((c) => c.required);
  const okCount = required.filter((c) => c.ok).length;
  const missing = required.filter((c) => !c.ok);
  const [open, setOpen] = useState(!!checks && missing.length > 0);
  const tone = !checks ? 'neutral' : missing.length ? 'warn' : 'ok';

  return (
    <div className={`req-card req-${tone}`}>
      <button type="button" className="req-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name={tone === 'ok' ? 'ShieldCheck' : tone === 'warn' ? 'ShieldAlert' : 'ListChecks'} size={20} />
        <span>
          <b>Requisitos para validação</b>
          <small>
            {!checks
              ? 'Confira se o certificado tem estes itens'
              : missing.length
                ? `${okCount} de ${required.length} itens obrigatórios encontrados`
                : 'Todos os itens obrigatórios encontrados'}
          </small>
        </span>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={18} />
      </button>
      {open && (
        <div className="req-body">
          <ul>
            {(checks || CERT_REQUIREMENTS.map((r) => ({ ...r, ok: null }))).map((c) => (
              <li key={c.key} className={c.ok === true ? 'is-ok' : c.ok === false && c.required ? 'is-miss' : 'is-neutral'}>
                <Icon name={c.ok === true ? 'CircleCheck' : c.ok === false && c.required ? 'CircleX' : 'Circle'} size={18} />
                <span>
                  {c.label}
                  {!c.required && <em> (recomendado)</em>}
                  <small>Ex.: {c.example}</small>
                </span>
              </li>
            ))}
          </ul>
          {checks && missing.length > 0 && (
            <p className="req-note">
              Não encontramos {listPt(missing.map((m) => SHORT_LABEL[m.key]))} no arquivo. Se faltar mesmo, a coordenação pode recusar: peça ao organizador um certificado corrigido. Se for só a leitura que falhou (foto escura ou torta), pode guardar normalmente.
            </p>
          )}
          {ielusc && <p className="req-note">Na IELUSC, entregue o certificado original e uma cópia simples à coordenação.</p>}
        </div>
      )}
    </div>
  );
}

// Prévia do certificado no padrão do modelo (8º Comunicathon), montada com os dados do evento.
export function CertificatePreview({ event, participant = 'Nome do participante', compact }) {
  const period = periodText(event);
  const hours = Number(event.hours) > 0 ? formatHours(event.hours).replace('h', ' horas') : '[carga horária]';
  return (
    <div className={`cert-preview ${compact ? 'cert-preview-sm' : ''}`} aria-label="Prévia do certificado">
      <span className="cp-kicker">Certificamos que</span>
      <b className="cp-name">{participant}</b>
      <p>
        {participationText(event.cert_participation)} <b>{event.title || '[nome do evento]'}</b>
        {period ? `, ${period}` : ', [data ou período]'}
        {event.cert_issuer ? `, promovido por ${event.cert_issuer}` : ', [instituição responsável]'}.
      </p>
      <p>
        Totalizando <b>{hours}</b> de atividade complementar.
      </p>
      <div className="cp-sign">
        <i />
        <b>{event.cert_signer_name || '[nome de quem assina]'}</b>
        <span>{event.cert_signer_role || '[cargo]'}</span>
      </div>
    </div>
  );
}

export const PARTICIPATION_OPTIONS = [
  { value: 'participou', label: 'Participou (ouvinte ou participante)' },
  { value: 'organizou', label: 'Participou da organização' },
  { value: 'apresentou', label: 'Apresentou trabalho' },
  { value: 'ministrou', label: 'Ministrou ou palestrou' },
  { value: 'concluiu', label: 'Concluiu o curso ou oficina' },
];

function participationText(v) {
  return (
    {
      organizou: 'participou da organização do evento',
      apresentou: 'apresentou trabalho no evento',
      ministrou: 'ministrou atividade no evento',
      concluiu: 'concluiu a atividade',
    }[v] || 'participou do evento'
  );
}

const TZ = 'America/Sao_Paulo';
const parts = (iso) => {
  const d = new Date(iso);
  const get = (o) => new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, ...o }).format(d);
  return { day: Number(get({ day: 'numeric' })), month: get({ month: 'long' }), year: get({ year: 'numeric' }) };
};

// Como no modelo: "entre os dias 11 e 22 de maio de 2026" / "em 17 de novembro de 2026"
function periodText(ev) {
  if (!ev.starts_at) return '';
  const a = parts(ev.starts_at);
  const b = ev.ends_at ? parts(ev.ends_at) : a;
  if (a.day === b.day && a.month === b.month && a.year === b.year) return `em ${a.day} de ${a.month} de ${a.year}`;
  if (a.month === b.month && a.year === b.year) return `entre os dias ${a.day} e ${b.day} de ${b.month} de ${b.year}`;
  if (a.year === b.year) return `de ${a.day} de ${a.month} a ${b.day} de ${b.month} de ${b.year}`;
  return `de ${a.day} de ${a.month} de ${a.year} a ${b.day} de ${b.month} de ${b.year}`;
}

// Checklist do organizador: o certificado que ele vai emitir tem tudo?
export function eventCertChecks(ev) {
  return [
    { key: 'name', label: 'Nome completo de cada participante', ok: true, note: 'Você inclui ao emitir' },
    { key: 'activity', label: 'Nome do evento', ok: !!ev.title?.trim() },
    { key: 'participation', label: 'Como a pessoa participou', ok: !!ev.cert_participation },
    { key: 'period', label: 'Data ou período', ok: !!ev.starts_at },
    { key: 'issuer', label: 'Instituição responsável', ok: !!ev.cert_issuer?.trim() },
    { key: 'hours', label: 'Carga horária total', ok: Number(ev.hours) > 0 },
    { key: 'signer', label: 'Nome e cargo de quem assina', ok: !!(ev.cert_signer_name?.trim() && ev.cert_signer_role?.trim()) },
  ];
}

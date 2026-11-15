import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getCourse, getInstitution, institutionLabel, typeLabel } from '../lib/rules.js';
import { formatHours } from '../lib/progress.js';
import { Badge, Bar, Button, Empty, Icon, Ring, Segmented } from '../components/ui.jsx';
import CertificateForm, { CERT_STATUS } from './CertificateForm.jsx';
import { SHORT_LABEL, listPt } from '../components/certificate.jsx';

export default function Vault() {
  const { api, profile, progress, certificates, notify } = useStore();
  const [tab, setTab] = useState('cat');
  const [form, setForm] = useState({ open: false, cert: null });
  const [openType, setOpenType] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const inst = getInstitution(profile.institution_id);
  const course = getCourse(profile.institution_id, profile.course_id);

  const countedById = useMemo(() => {
    const m = {};
    for (const t of progress.types) for (const it of t.items) m[it.id] = it;
    return m;
  }, [progress]);

  const emptyTypes = progress.types.filter((t) => !t.items.length && t.key !== '_outros');

  async function openFile(c) {
    // abre a aba antes do await: Safari/iPhone bloqueia pop-up aberto depois de esperar a rede
    const win = window.open('', '_blank');
    try {
      const url = await api.fileUrl(c.file_path);
      if (url && win) win.location.href = url;
      else if (url) window.location.href = url;
      else {
        win?.close();
        notify('Arquivo não encontrado neste aparelho.', 'error');
      }
    } catch (e) {
      win?.close();
      notify(e.message, 'error');
    }
  }

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Cofre digital</span>
          <h1 className="top-title">Minhas horas</h1>
        </div>
        <Link to="/relatorio" className="icon-btn icon-btn-soft" aria-label="Relatório acadêmico">
          <Icon name="FileText" />
        </Link>
      </header>

      <section className="summary">
        <div className="summary-main">
          <Ring pct={progress.pct} size={128} stroke={13}>
            <b className="ring-big">{progress.pct}%</b>
            <span>da meta</span>
          </Ring>
          <div className="summary-nums">
            <div>
              <span>Horas que contam</span>
              <b>
                {formatHours(progress.counted)} <small>/ {formatHours(progress.goal)}</small>
              </b>
            </div>
            <div>
              <span>{progress.done ? 'Meta batida' : 'Faltam'}</span>
              <b className="text-brand">{progress.done ? '✓' : formatHours(progress.remaining)}</b>
            </div>
            <div>
              <span>Já validadas</span>
              <b className="text-ok">{formatHours(progress.validated)}</b>
            </div>
          </div>
        </div>
        <p className="summary-course">
          <Icon name="GraduationCap" size={15} /> {inst.custom ? `${institutionLabel(profile)} · meta de ${progress.goal}h` : `${inst.name} · ${course.name}`}
        </p>
        {progress.lost > 0 && (
          <div className="alert alert-warn">
            <Icon name="TriangleAlert" size={18} />
            <span>
              <b>{formatHours(progress.lost)}</b> dos seus certificados passam dos limites da tabela e não contam. Procure categorias com espaço.
            </span>
          </div>
        )}
        <div className="row-gap">
          <Button block icon="ShieldPlus" onClick={() => setForm({ open: true, cert: null })}>
            Guardar certificado
          </Button>
          <Link to="/relatorio" className="btn btn-ghost">
            <Icon name="Download" size={18} /> <span>Relatório</span>
          </Link>
        </div>
      </section>

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'cat', label: 'Por categoria' },
          { value: 'list', label: 'Certificados', count: certificates.length },
        ]}
      />

      {tab === 'cat' && (
        <div className="types">
          {progress.active.length === 0 && (
            <Empty icon="ShieldCheck" title="Seu cofre está vazio" text="Guarde o primeiro certificado e veja na hora quanto falta em cada categoria." />
          )}
          {progress.active.map((t) => (
            <div key={t.key} className="type-card">
              <button className="type-head" onClick={() => setOpenType(openType === t.key ? null : t.key)} aria-expanded={openType === t.key}>
                <div className="type-name">
                  <b>{t.code ? `${t.code} · ` : ''}{t.label}</b>
                  <span>
                    {formatHours(t.counted)} {t.max != null && !inst.custom ? `de ${formatHours(t.max)}` : ''}
                    {t.excess > 0 ? ` · ${formatHours(t.excess)} fora do limite` : ''}
                  </span>
                </div>
                <Icon name={openType === t.key ? 'ChevronUp' : 'ChevronDown'} size={18} />
              </button>
              {t.max != null && !inst.custom && <Bar value={t.counted} max={t.max} tone={t.counted >= t.max ? 'ok' : 'brand'} thin />}
              {openType === t.key && (
                <ul className="type-items">
                  {t.items.map((it) => (
                    <li key={it.id}>
                      <button onClick={() => setForm({ open: true, cert: certificates.find((c) => c.id === it.id) })}>
                        <span>{it.title}</span>
                        <b>{formatHours(it.counted)}</b>
                      </button>
                      {it.note && <small>{it.note}</small>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {emptyTypes.length > 0 && !progress.done && (
            <div className="room-box">
              <button className="room-head" onClick={() => setShowAll(!showAll)}>
                <span>
                  <Icon name="Lightbulb" size={18} /> {emptyTypes.length} categorias ainda sem nenhuma hora
                </span>
                <Icon name={showAll ? 'ChevronUp' : 'ChevronDown'} size={18} />
              </button>
              {showAll && (
                <ul className="room-list">
                  {emptyTypes.map((t) => (
                    <li key={t.key}>
                      <span>{t.code ? `${t.code} · ` : ''}{t.label}</span>
                      <b>{t.max != null && !inst.custom ? `até ${t.max}h` : 'livre'}</b>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'list' && (
        <div className="cert-list">
          {!certificates.length && <Empty icon="FileStack" title="Nenhum certificado ainda" text="Tire uma foto do certificado e guarde aqui. Ele fica salvo mesmo se você trocar de celular." />}
          {certificates.map((c) => {
            const st = CERT_STATUS.find((s) => s.value === c.status) || CERT_STATUS[0];
            const it = countedById[c.id];
            return (
              <article key={c.id} className="cert">
                <div className="cert-ic">
                  <Icon name={c.file_mime === 'application/pdf' ? 'FileText' : c.file_path ? 'Image' : 'FileQuestion'} size={22} />
                </div>
                <div className="cert-body">
                  <h3>{c.title}</h3>
                  <p>{typeLabel(profile.institution_id, c.type_key)}</p>
                  <div className="row-gap wrap">
                    <Badge tone={st.tone}>{st.label.replace('Só guardado no cofre', 'Guardado')}</Badge>
                    <span className="cert-hours">
                      {it && it.counted !== c.hours ? (
                        <>
                          <s>{formatHours(c.hours)}</s> {formatHours(it.counted)} contam
                        </>
                      ) : (
                        `${formatHours(c.hours)}`
                      )}
                    </span>
                  </div>
                  {c.missing_requirements?.length > 0 && (
                    <span className="cert-warn">
                      <Icon name="ShieldAlert" size={14} /> Falta no certificado: {listPt(c.missing_requirements.map((k) => SHORT_LABEL[k] || k))}
                    </span>
                  )}
                  {Array.isArray(c.missing_requirements) && c.missing_requirements.length === 0 && (
                    <span className="cert-okline">
                      <Icon name="BadgeCheck" size={14} /> Tem todos os itens obrigatórios
                    </span>
                  )}
                </div>
                <div className="cert-actions">
                  {c.file_path && (
                    <button className="icon-btn icon-btn-soft" onClick={() => openFile(c)} aria-label="Abrir arquivo">
                      <Icon name="Eye" size={18} />
                    </button>
                  )}
                  <button className="icon-btn icon-btn-soft" onClick={() => setForm({ open: true, cert: c })} aria-label="Editar">
                    <Icon name="Pencil" size={18} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <button className="fab" onClick={() => setForm({ open: true, cert: null })} aria-label="Guardar certificado">
        <Icon name="Plus" size={26} />
      </button>

      <CertificateForm open={form.open} cert={form.cert} onClose={() => setForm({ open: false, cert: null })} />
    </div>
  );
}

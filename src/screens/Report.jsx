import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getCourse, getInstitution, institutionLabel } from '../lib/rules.js';
import { formatHours } from '../lib/progress.js';
import { Button, Icon, Logo } from '../components/ui.jsx';
import { CERT_STATUS } from './CertificateForm.jsx';

const fmtDate = (d) => (d ? new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR') : '—');

export default function Report() {
  const { profile, progress } = useStore();
  const inst = getInstitution(profile.institution_id);
  const course = getCourse(profile.institution_id, profile.course_id);
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="page report-page">
      <div className="no-print row-between">
        <Link to="/cofre" className="back-link">
          <Icon name="ChevronLeft" size={18} /> Cofre
        </Link>
        <Button icon="Printer" onClick={() => window.print()}>
          Imprimir ou salvar PDF
        </Button>
      </div>

      <article className="report">
        <header className="report-head">
          <div>
            <h1>Relatório de horas complementares</h1>
            <p>
              <b>{profile.name}</b> · {profile.email}
            </p>
            <p>
              {institutionLabel(profile)} · {inst.custom ? `meta informada: ${progress.goal}h` : course.name}
              {profile.semester ? ` · ${profile.semester}º semestre` : ''}
            </p>
            <p className="small">Gerado em {today} pelo Àquelas Horas. Regras: {inst.source}.</p>
          </div>
          <Logo height={64} />
        </header>

        <div className="report-totals">
          <div>
            <span>Horas que contam</span>
            <b>
              {formatHours(progress.counted)} / {formatHours(progress.goal)}
            </b>
          </div>
          <div>
            <span>Faltam</span>
            <b>{formatHours(progress.remaining)}</b>
          </div>
          <div>
            <span>Validadas pela faculdade</span>
            <b>{formatHours(progress.validated)}</b>
          </div>
          <div>
            <span>Certificados</span>
            <b>{progress.certificates}</b>
          </div>
        </div>

        <div className="report-scroll">
        <table className="report-table">
          <thead>
            <tr>
              <th>Atividade</th>
              <th>Data</th>
              <th>Situação</th>
              <th className="num">Carga</th>
              <th className="num">Conta</th>
            </tr>
          </thead>
          {progress.active.map((t) => (
            <tbody key={t.key}>
              <tr className="report-type">
                <td colSpan={3}>
                  {t.code ? `${t.code} · ` : ''}
                  {t.label}
                  {t.max != null && !inst.custom ? ` (teto ${t.max}h)` : ''}
                </td>
                <td className="num">{formatHours(t.raw)}</td>
                <td className="num">{formatHours(t.counted)}</td>
              </tr>
              {t.items.map((it) => (
                <tr key={it.id}>
                  <td>
                    {it.title}
                    {it.issuer ? <small> · {it.issuer}</small> : null}
                    {it.note ? <small className="report-note"> ({it.note})</small> : null}
                  </td>
                  <td>{fmtDate(it.issued_on)}</td>
                  <td>{(CERT_STATUS.find((s) => s.value === it.status) || CERT_STATUS[0]).label.replace('Só guardado no cofre', 'Guardado')}</td>
                  <td className="num">{formatHours(it.hours)}</td>
                  <td className="num">{formatHours(it.counted)}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
        </div>
        {!progress.active.length && <p className="muted">Nenhum certificado guardado ainda.</p>}
        <p className="small muted report-foot">
          Este relatório organiza os certificados guardados pelo aluno e aplica os limites da tabela do curso. A validação oficial das horas é feita pela coordenação da instituição.
        </p>
      </article>
    </div>
  );
}

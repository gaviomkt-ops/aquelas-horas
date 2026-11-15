import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getInstitution, typeLabel } from '../lib/rules.js';
import { formatHours } from '../lib/progress.js';
import { situacao, csvCertificados, csvResumo, filtrar, nomeArquivo, resumoPorAluno, totais } from '../lib/secretaria.js';
import { Badge, Bar, Button, Empty, Field, Icon } from '../components/ui.jsx';

const TOM = { entregue: 'warn', validado: 'ok', recusado: 'error' };
const dataBR = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00`).toLocaleDateString('pt-BR') : '—');

function baixar(conteudo, nome) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Aba da secretaria (piloto IELUSC): só alunos da instituição que autorizaram, só certificados enviados.
export default function Secretaria() {
  const { api, profile, notify } = useStore();
  const instId = profile.institution_id;
  const inst = getInstitution(instId);
  const [alunos, setAlunos] = useState(null);
  const [certs, setCerts] = useState([]);
  const [f, setF] = useState({ texto: '', curso: '', ano: '', turma: '', status: 'entregue' });
  const [aberto, setAberto] = useState(null);
  const [busy, setBusy] = useState('');

  const carregar = useCallback(async () => {
    try {
      const [a, c] = await Promise.all([api.secListStudents(instId), api.secListCertificates()]);
      setAlunos(a || []);
      setCerts(c || []);
    } catch (e) {
      notify(e.message, 'error');
      setAlunos([]);
    }
  }, [api, instId, notify]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const visao = useMemo(() => filtrar(alunos || [], certs, f), [alunos, certs, f]);
  const linhas = useMemo(() => resumoPorAluno(visao.alunos, visao.certs), [visao]);
  // progresso usa todos os certificados enviados do aluno, não só os do filtro de status
  const resumoCompleto = useMemo(() => Object.fromEntries(resumoPorAluno(visao.alunos, certs).map((r) => [r.aluno.id, r])), [visao.alunos, certs]);
  const t = totais(filtrar(alunos || [], certs, { ...f, status: '' }).certs);
  const anos = [...new Set((alunos || []).map((a) => a.entry_year).filter(Boolean))].sort((a, b) => b - a);
  const turmas = [...new Set((alunos || []).map((a) => a.class_group).filter(Boolean))].sort();

  async function avaliar(cert, status) {
    let nota = '';
    if (status === 'recusado') {
      nota = window.prompt('Motivo da recusa (o aluno vai ver):', cert.review_note || '');
      if (nota === null) return;
      if (!nota.trim()) return notify('Escreva o motivo da recusa.', 'error');
    }
    setBusy(cert.id);
    try {
      const novo = await api.reviewCertificate(cert.id, status, nota);
      setCerts((prev) => prev.map((c) => (c.id === cert.id ? { ...c, ...novo } : c)));
      notify(status === 'validado' ? 'Certificado validado.' : status === 'recusado' ? 'Certificado recusado.' : 'Voltou para análise.');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy('');
    }
  }

  async function verArquivo(cert) {
    try {
      const url = await api.fileUrl(cert.file_path);
      if (url) window.open(url, '_blank', 'noopener');
      else notify('Arquivo não encontrado.', 'error');
    } catch (e) {
      notify(e.message, 'error');
    }
  }

  if (alunos === null) return <div className="page"><p className="muted">Carregando…</p></div>;

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Secretaria · piloto</span>
          <h1 className="top-title">{inst.name}</h1>
        </div>
        <button type="button" className="icon-btn icon-btn-soft" onClick={carregar} aria-label="Atualizar">
          <Icon name="RefreshCw" />
        </button>
      </header>

      <div className="alert alert-info">
        <Icon name="ShieldCheck" size={18} />
        <span>
          Aqui aparecem só os alunos desta instituição que <b>autorizaram</b> o compartilhamento e só os certificados que eles marcaram como entregues. As horas são informadas pelo aluno: use esta tela como triagem. O registro oficial continua no sistema acadêmico da faculdade.
        </span>
      </div>

      <div className="sec-kpis">
        <button type="button" className={`sec-kpi ${f.status === 'entregue' ? 'sec-kpi-on' : ''}`} onClick={() => setF({ ...f, status: 'entregue' })}>
          <b>{t.entregue}</b>
          <span>Aguardando</span>
        </button>
        <button type="button" className={`sec-kpi ${f.status === 'validado' ? 'sec-kpi-on' : ''}`} onClick={() => setF({ ...f, status: 'validado' })}>
          <b>{t.validado}</b>
          <span>Validados</span>
        </button>
        <button type="button" className={`sec-kpi ${f.status === 'recusado' ? 'sec-kpi-on' : ''}`} onClick={() => setF({ ...f, status: 'recusado' })}>
          <b>{t.recusado}</b>
          <span>Recusados</span>
        </button>
        <button type="button" className={`sec-kpi ${!f.status ? 'sec-kpi-on' : ''}`} onClick={() => setF({ ...f, status: '' })}>
          <b>{(alunos || []).length}</b>
          <span>Alunos</span>
        </button>
      </div>

      <div className="card-pad sec-filtros">
        <div className="rg-search">
          <Icon name="Search" size={18} />
          <input type="search" value={f.texto} onChange={set('texto')} placeholder="Nome, e-mail ou matrícula" aria-label="Buscar aluno" />
        </div>
        <div className="sec-grid">
          <Field label="Curso" htmlFor="sf-curso">
            <select id="sf-curso" value={f.curso} onChange={set('curso')}>
              <option value="">Todos</option>
              {inst.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ano de ingresso" htmlFor="sf-ano">
            <select id="sf-ano" value={f.ano} onChange={set('ano')}>
              <option value="">Todos</option>
              {anos.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Turma" htmlFor="sf-turma">
            <select id="sf-turma" value={f.turma} onChange={set('turma')}>
              <option value="">Todas</option>
              {turmas.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="rg-acoes">
          <Button variant="soft" size="sm" icon="Download" onClick={() => baixar(csvCertificados(visao.alunos, visao.certs), nomeArquivo('certificados', instId, f))} disabled={!visao.certs.length}>
            Planilha de certificados
          </Button>
          <Button variant="soft" size="sm" icon="Download" onClick={() => baixar(csvResumo(visao.alunos, certs), nomeArquivo('resumo-por-aluno', instId, f))} disabled={!visao.alunos.length}>
            Resumo por aluno
          </Button>
        </div>
        <p className="small muted">As planilhas saem em CSV (abre no Excel e no Google Planilhas) com o filtro aplicado. Guarde-as só em local seguro da faculdade: têm dados pessoais.</p>
      </div>

      <section className="sec">
        <h2 className="sec-title">
          {linhas.length} {linhas.length === 1 ? 'aluno' : 'alunos'} · {visao.certs.length} {visao.certs.length === 1 ? 'certificado' : 'certificados'}
        </h2>
        <div className="rg-lista">
          {linhas.map(({ aluno, certs: meus }) => {
            const r = resumoCompleto[aluno.id];
            const open = aberto === aluno.id;
            return (
              <div key={aluno.id} className="card-pad sec-aluno">
                <button type="button" className="sec-aluno-head" onClick={() => setAberto(open ? null : aluno.id)} aria-expanded={open}>
                  <div className="rg-row-main">
                    <b>{aluno.name}</b>
                    <span className="small muted">
                      {[aluno.student_number && `Matrícula ${aluno.student_number}`, inst.courses.find((c) => c.id === aluno.course_id)?.name, aluno.entry_year && `ingresso ${aluno.entry_year}`, aluno.class_group].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <div className="rg-row-side">
                    <b>
                      {formatHours(r?.contam || 0)} / {formatHours(r?.meta || 0)}
                    </b>
                    <span className="small muted">{formatHours(r?.validadas || 0)} validadas</span>
                  </div>
                  <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={18} />
                </button>
                <Bar value={r?.contam || 0} max={r?.meta || 1} thin />
                {open && (
                  <div className="sec-certs">
                    {meus.map((c) => (
                      <div key={c.id} className="sec-cert">
                        <div className="row-between">
                          <b>{c.title}</b>
                          <Badge tone={TOM[c.status] || 'neutral'}>{situacao(c)}</Badge>
                        </div>
                        <p className="small muted">
                          {typeLabel(aluno.institution_id, c.type_key)} · {formatHours(Number(c.hours) || 0)} · {dataBR(c.issued_on)} {c.issuer ? `· ${c.issuer}` : ''}
                        </p>
                        {c.missing_requirements?.length > 0 && (
                          <p className="small rg-contradicao">
                            <Icon name="TriangleAlert" size={14} /> A leitura automática não achou: {c.missing_requirements.join(', ')}
                          </p>
                        )}
                        {c.review_note && <p className="small">Observação: {c.review_note}</p>}
                        <div className="rg-acoes">
                          {c.file_path ? (
                            <Button variant="ghost" size="sm" icon="FileText" onClick={() => verArquivo(c)}>
                              Ver arquivo
                            </Button>
                          ) : (
                            <span className="small muted">Sem arquivo anexado</span>
                          )}
                          {c.status !== 'validado' && (
                            <Button size="sm" icon="Check" loading={busy === c.id} onClick={() => avaliar(c, 'validado')}>
                              Validar
                            </Button>
                          )}
                          {c.status !== 'recusado' && (
                            <Button variant="soft" size="sm" icon="X" loading={busy === c.id} onClick={() => avaliar(c, 'recusado')}>
                              Recusar
                            </Button>
                          )}
                          {c.status !== 'entregue' && (
                            <Button variant="ghost" size="sm" onClick={() => avaliar(c, 'entregue')} loading={busy === c.id}>
                              Voltar para análise
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!meus.length && <p className="small muted">Nenhum certificado com esse filtro.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!linhas.length && (
          <Empty icon="Inbox" title="Nada por aqui" text={(alunos || []).length ? 'Nenhum aluno ou certificado com esse filtro.' : 'Nenhum aluno autorizou o compartilhamento ainda.'} />
        )}
      </section>

      <Link to="/regras/ielusc" className="rg-entry">
        <Icon name="ScrollText" size={22} />
        <span>
          <b>Regras · {inst.name}</b>
          <small>Res. CES 53/2026, tabela de tetos e alertas</small>
        </span>
        <Icon name="ChevronRight" size={18} />
      </Link>
    </div>
  );
}

import { useMemo } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { EXTENSAO_LABEL, STATUS_NORMA, alertasDoCurso, fonteOficial, formatHorasCatalogo, getInstituicao, PESQUISA_EM } from '../data/acg/index.js';
import { Badge, Field, Icon } from '../components/ui.jsx';
import { AlertaLista, SituacaoBadge } from './Regras.jsx';

const TOM_BADGE = { ok: 'ok', aviso: 'warn', alerta: 'error' };
const ehUrl = (s) => /^https?:\/\//i.test(s || '');

function PdfBotao({ url, children = 'Abrir PDF oficial' }) {
  if (!ehUrl(url)) return <span className="small muted">Sem link público confirmado: peça o documento à secretaria.</span>;
  return (
    <a className="btn btn-soft btn-sm" href={url} target="_blank" rel="noopener noreferrer">
      <Icon name="ExternalLink" size={16} /> <span>{children}</span>
    </a>
  );
}

function Linha({ rotulo, children }) {
  return (
    <div className="rg-linha">
      <span className="rg-rotulo">{rotulo}</span>
      <span>{children}</span>
    </div>
  );
}

// Ficha da instituição: regras, alertas e o botão para abrir o PDF oficial.
export default function RegrasFicha() {
  const { instId } = useParams();
  const [params, setParams] = useSearchParams();
  const inst = getInstituicao(instId);
  const cursoId = params.get('curso') || '';
  const curso = inst?.cursos.find((c) => c.id === cursoId) || null;
  const alertas = useMemo(() => (inst ? alertasDoCurso(inst, curso) : []), [inst, curso]);
  if (!inst) return <Navigate to="/regras" replace />;

  const norma = inst.normas.find((n) => n.id === curso?.norma_aplicavel) || null;
  const normaUrl = curso ? norma?.url || fonteOficial(inst, curso) : '';
  const fonteUrl = curso && ehUrl(curso.horas.fonte) ? curso.horas.fonte : '';
  const extensao = curso?.extensao || inst.extensao;
  const colunaAlt = curso?.coluna_alternativa ? Object.keys(curso.coluna_alternativa)[0] : null;
  const colunaSel = inst.categorias ? (params.get('col') && inst.colunas_tetos.includes(params.get('col')) ? params.get('col') : curso?.coluna || '') : '';

  return (
    <div className="page">
      <Link to="/regras" className="back-link">
        <Icon name="ChevronLeft" size={18} /> Regras
      </Link>
      <header className="rg-head">
        <span className="eyebrow">{inst.campus} · pesquisa de {PESQUISA_EM}</span>
        <h1 className="top-title">{inst.nome}</h1>
        <p className="muted">{inst.resumo}</p>
      </header>

      <section className="sec">
        <h2 className="sec-title">Alertas</h2>
        <AlertaLista alertas={alertas} />
        {!alertas.length && <p className="small muted">Nenhum alerta registrado para esta seleção.</p>}
      </section>

      <section className="sec">
        <h2 className="sec-title">Seu curso e matriz</h2>
        <Field label="Escolha o curso e a matriz do seu ano de ingresso" htmlFor="rg-curso">
          <select id="rg-curso" value={cursoId} onChange={(e) => setParams(e.target.value ? { curso: e.target.value } : {})}>
            <option value="">Selecione…</option>
            {inst.cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} · {c.matriz?.codigo}
              </option>
            ))}
          </select>
        </Field>
        {curso && (
          <div className="card-pad rg-curso">
            <div className="row-between">
              <b>{curso.nome}</b>
              <SituacaoBadge situacao={curso.horas.situacao} />
            </div>
            <p className="small muted">{curso.matriz?.codigo}</p>
            <p className={`rg-horas ${curso.horas.valor == null ? 'rg-sem' : ''}`}>{formatHorasCatalogo(curso.horas)}</p>
            {curso.horas.nota && <p className="small">{curso.horas.nota}</p>}
            {curso.horas.alternativa && (
              <p className="small rg-contradicao">
                Outra fonte diz <b>{curso.horas.alternativa.valor} {curso.horas.alternativa.unidade}</b> ({curso.horas.alternativa.origem}).
              </p>
            )}
            {curso.limites_destaque && <p className="small">{curso.limites_destaque}</p>}
            {curso.regulamento_ppc && <p className="small">{curso.regulamento_ppc}</p>}
            {curso.como_enviar_curso && <p className="small">Envio: {curso.como_enviar_curso}</p>}
            {norma && (
              <p className="small">
                Norma aplicável: <b>{norma.numero}</b> <Badge tone={TOM_BADGE[STATUS_NORMA[norma.status]?.tom] || 'neutral'}>{STATUS_NORMA[norma.status]?.label}</Badge>
                {curso.norma_base === 'inferido_da_matriz' && ' (inferida da data da matriz: confirme)'}
              </p>
            )}
            {curso.a_confirmar?.length > 0 && (
              <div className="rg-confirmar">
                <b>A confirmar com a secretaria</b>
                <ul>
                  {curso.a_confirmar.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rg-acoes">
              <PdfBotao url={normaUrl}>{norma ? 'Abrir a norma (PDF oficial)' : 'Abrir a norma vigente (PDF oficial)'}</PdfBotao>
              {fonteUrl && fonteUrl !== normaUrl && <PdfBotao url={fonteUrl}>Abrir a matriz/fonte do número</PdfBotao>}
            </div>
          </div>
        )}
      </section>

      <section className="sec">
        <h2 className="sec-title">Norma vigente e histórico</h2>
        <div className="rg-lista">
          {inst.normas.map((n) => (
            <div key={n.id} className="card-pad rg-norma">
              <div className="row-between">
                <b>{n.numero}</b>
                <Badge tone={TOM_BADGE[STATUS_NORMA[n.status]?.tom] || 'neutral'}>{STATUS_NORMA[n.status]?.label || n.status}</Badge>
              </div>
              {n.data && <p className="small muted">{n.data}</p>}
              {n.aplica_se && <p className="small">Vale para: {n.aplica_se}</p>}
              {n.nota && <p className="small">{n.nota}</p>}
              <PdfBotao url={n.url} />
            </div>
          ))}
          {!inst.normas.length && <p className="small muted">Nenhuma norma pública localizada.</p>}
        </div>
      </section>

      <section className="sec">
        <h2 className="sec-title">Como enviar e validar</h2>
        <div className="card-pad rg-linhas">
          <Linha rotulo="Requisito">{inst.requisito_nome}</Linha>
          <Linha rotulo="Sistema">{inst.como_enviar.sistema}</Linha>
          <Linha rotulo="Prazo">{inst.como_enviar.prazo}</Linha>
          <Linha rotulo="Quem aprova">{inst.como_enviar.quem_aprova}</Linha>
          <Linha rotulo="Taxa">{inst.como_enviar.taxa}</Linha>
          <p className="small muted">Fonte: {inst.como_enviar.fonte}</p>
        </div>
      </section>

      <section className="sec">
        <h2 className="sec-title">Relação com a extensão curricular</h2>
        <div className="card-pad stack">
          <b>A mesma hora conta nas duas? {EXTENSAO_LABEL[extensao.mesma_hora_conta_nas_duas]}</b>
          <p className="small">{extensao.regra}</p>
          {extensao.fonte && <p className="small muted">Fonte: {extensao.fonte}</p>}
        </div>
      </section>

      {inst.regras_gerais?.length > 0 && (
        <section className="sec">
          <h2 className="sec-title">Regras gerais</h2>
          <div className="card-pad stack">
            {inst.regras_gerais.map((r, i) => (
              <p key={i} className="small">
                {r.texto} <span className="muted">({r.fonte})</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {inst.categorias && (
        <section className="sec">
          <h2 className="sec-title">Categorias e tetos (Tabela 2026)</h2>
          {!colunaSel && <p className="small muted">Escolha um curso acima para ver o teto de cada categoria no seu curso.</p>}
          {colunaAlt && (
            <div className="chips">
              <button type="button" className={`chip ${colunaSel === curso.coluna ? 'chip-active' : ''}`} onClick={() => setParams({ curso: cursoId })}>
                Currículo 2026
              </button>
              <button type="button" className={`chip ${colunaSel === colunaAlt ? 'chip-active' : ''}`} onClick={() => setParams({ curso: cursoId, col: colunaAlt })}>
                {curso.coluna_alternativa[colunaAlt]}
              </button>
            </div>
          )}
          {colunaSel && (
            <div className="card-pad rg-tabela">
              {inst.categorias.map((cat) => {
                const v = cat.tetos[inst.colunas_tetos.indexOf(colunaSel)];
                return (
                  <div key={cat.id} className="rg-cat">
                    <span>
                      {cat.nome}
                      {cat.limite_item && <small> · {cat.limite_item}</small>}
                      {cat.comprovante && <small> · {cat.comprovante}</small>}
                    </span>
                    <b>{v == null ? 'não aceita' : `até ${v} h`}</b>
                  </div>
                );
              })}
              {inst.categorias_fixas?.map((f) => (
                <div key={f.nome} className="rg-cat">
                  <span>
                    {f.nome} <small>· {f.regra}</small>
                  </span>
                </div>
              ))}
              <p className="small muted">Tetos máximos por categoria (horas), conforme a Tabela de Equivalência 2026. Fonte: Res. CES 53/2026 e Tabela ACG 2026.</p>
            </div>
          )}
        </section>
      )}

      {inst.categorias_parciais?.length > 0 && (
        <section className="sec">
          <h2 className="sec-title">Limites encontrados</h2>
          <div className="card-pad stack">
            {inst.categorias_parciais.map((c) => (
              <p key={c.nome} className="small">
                <b>{c.nome}:</b> {c.regra}
              </p>
            ))}
            <p className="small muted">São os limites que a pesquisa localizou; a tabela completa está no Anexo I da norma.</p>
          </div>
        </section>
      )}

      <section className="sec">
        <h2 className="sec-title">Todos os cursos e matrizes ({inst.cursos.length})</h2>
        <div className="rg-lista">
          {inst.cursos.map((c) => (
            <button key={c.id} type="button" className={`rg-row rg-row-btn ${c.id === cursoId ? 'rg-row-on' : ''}`} onClick={() => setParams({ curso: c.id })}>
              <div className="rg-row-main">
                <b>{c.nome}</b>
                <span className="small muted">{c.matriz?.codigo}</span>
              </div>
              <div className="rg-row-side">
                <b className={c.horas.valor == null ? 'rg-sem' : ''}>{formatHorasCatalogo(c.horas)}</b>
                <SituacaoBadge situacao={c.horas.situacao} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {inst.sistemas_academicos && <p className="small muted">Sistemas citados na pesquisa: {inst.sistemas_academicos}</p>}
    </div>
  );
}

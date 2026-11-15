import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { AVISO_EMEC, CATALOGO, PESQUISA_EM, SITUACAO, alertasDoCurso, buscarCatalogo, formatHorasCatalogo, nivelMaisGrave } from '../data/acg/index.js';
import { Badge, Chip, Empty, Icon } from '../components/ui.jsx';

const TOM_BADGE = { ok: 'ok', aviso: 'warn', alerta: 'error' };
const ANOS = Array.from({ length: 12 }, (_, i) => 2026 - i);

export function SituacaoBadge({ situacao }) {
  const s = SITUACAO[situacao] || { label: situacao, tom: 'aviso' };
  return <Badge tone={TOM_BADGE[s.tom] || 'neutral'}>{s.label}</Badge>;
}

export function AlertaLista({ alertas }) {
  if (!alertas?.length) return null;
  return (
    <div className="stack rg-alertas">
      {alertas.map((a, i) => (
        <div key={i} className={`alert ${a.nivel === 'alto' ? 'alert-error' : a.nivel === 'medio' ? 'alert-warn' : 'alert-info'}`} role={a.nivel === 'alto' ? 'alert' : undefined}>
          <Icon name={a.nivel === 'info' ? 'CircleAlert' : 'TriangleAlert'} size={18} />
          <span>{a.texto}</span>
        </div>
      ))}
    </div>
  );
}

// Consulta pública das regras de horas complementares das instituições de Joinville-SC.
export default function Regras() {
  const { profile } = useStore();
  const [texto, setTexto] = useState('');
  const [instId, setInstId] = useState('');
  const [ano, setAno] = useState(profile?.entry_year ? String(profile.entry_year) : '');

  const lista = useMemo(() => buscarCatalogo({ texto, instituicaoId: instId, ano: ano ? Number(ano) : null }), [texto, instId, ano]);
  const grupos = useMemo(() => {
    const m = new Map();
    for (const r of lista) {
      if (!m.has(r.inst.id)) m.set(r.inst.id, { inst: r.inst, itens: [] });
      m.get(r.inst.id).itens.push(r.curso);
    }
    return [...m.values()];
  }, [lista]);

  return (
    <div className="page">
      <header className="top">
        <div>
          <span className="eyebrow">Joinville-SC · pesquisa de {PESQUISA_EM}</span>
          <h1 className="top-title">Regras das horas complementares</h1>
        </div>
      </header>

      <div className="alert alert-warn">
        <Icon name="TriangleAlert" size={18} />
        <span>
          <b>O número que vale é o da matriz do seu ano de ingresso.</b> A mesma instituição pode pedir 432 h/a de um aluno e 144 h/a de outro no mesmo curso. {AVISO_EMEC} Confirme sempre com a secretaria.
        </span>
      </div>

      <div className="stack rg-filtros">
        <div className="rg-search">
          <Icon name="Search" size={18} />
          <input type="search" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar instituição ou curso" aria-label="Buscar instituição ou curso" />
        </div>
        <div className="chips">
          <Chip active={!instId} onClick={() => setInstId('')}>
            Todas
          </Chip>
          {CATALOGO.map((i) => (
            <Chip key={i.id} active={instId === i.id} onClick={() => setInstId(i.id)}>
              {i.sigla}
            </Chip>
          ))}
        </div>
        <label className="rg-ano">
          <span>Ano de ingresso</span>
          <select value={ano} onChange={(e) => setAno(e.target.value)}>
            <option value="">Todos</option>
            {ANOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        {ano && <p className="small muted">Mostrando as matrizes que podem valer para quem ingressou em {ano}. Onde o catálogo não informa o corte de ingresso, a matriz continua na lista para você conferir.</p>}
      </div>

      {grupos.map(({ inst, itens }) => {
        const alertasInst = inst.alertas.filter((a) => a.nivel === 'alto').length;
        return (
          <section key={inst.id} className="sec">
            <Link to={`/regras/${inst.id}`} className="rg-inst">
              <div>
                <h2 className="sec-title">{inst.nome}</h2>
                <p className="small muted">{inst.requisito_nome}</p>
              </div>
              <span className="rg-inst-meta">
                {alertasInst > 0 && <Badge tone="error" icon="TriangleAlert">{alertasInst} {alertasInst === 1 ? 'alerta' : 'alertas'}</Badge>}
                <Icon name="ChevronRight" size={18} />
              </span>
            </Link>
            <div className="rg-lista">
              {itens.map((c) => {
                const grave = nivelMaisGrave(alertasDoCurso({ alertas: [] }, c));
                return (
                  <Link key={c.id} to={`/regras/${inst.id}?curso=${encodeURIComponent(c.id)}`} className="rg-row">
                    <div className="rg-row-main">
                      <b>{c.nome}</b>
                      <span className="small muted">{c.matriz?.codigo}</span>
                    </div>
                    <div className="rg-row-side">
                      <b className={c.horas.valor == null ? 'rg-sem' : ''}>{formatHorasCatalogo(c.horas)}</b>
                      <span className="rg-badges">
                        <SituacaoBadge situacao={c.horas.situacao} />
                        {grave && <Badge tone={grave === 'alto' ? 'error' : 'warn'} icon="TriangleAlert">alerta</Badge>}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {!grupos.length && <Empty icon="Search" title="Nada encontrado" text="Tente outro nome de curso ou limpe o ano de ingresso. A lista pode estar incompleta: o e-MEC bloqueou a consulta automática." />}
    </div>
  );
}

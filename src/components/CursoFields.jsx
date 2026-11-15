import { Link } from 'react-router-dom';
import { Field, Icon } from './ui.jsx';
import { alertasDoCurso, formatHorasCatalogo, getInstituicao, matrizCobreAno } from '../data/acg/index.js';

export const ANOS_INGRESSO = Array.from({ length: 12 }, (_, i) => 2026 - i);

// Cursos que podem valer para o ano de ingresso (só filtra instituições do catálogo; se nada sobrar, mostra todos).
export function cursosVisiveis(inst, entryYear) {
  const ano = Number(entryYear) || null;
  if (!inst?.catalog || !ano) return inst?.courses || [];
  const filtrados = inst.courses.filter((c) => matrizCobreAno(c.catalogRef, ano));
  return filtrados.length ? filtrados : inst.courses;
}

// Curso escolhido (ou o primeiro disponível) e se o aluno precisa digitar a meta.
export function cursoEscolhido(inst, f) {
  const lista = cursosVisiveis(inst, f.entry_year);
  const course = lista.find((c) => c.id === f.course_id) || lista[0];
  return { course, needsGoal: !!(inst?.custom || course?.needsGoal) };
}

// Campos que vão para o perfil: curso, meta (só quando o catálogo não traz número confiável) e ano de ingresso.
export function cursoPatch(inst, f) {
  const { course, needsGoal } = cursoEscolhido(inst, f);
  return {
    course_id: inst.custom ? 'OUTRO' : course.id,
    goal_hours: needsGoal ? Number(f.goal_hours) || null : null,
    entry_year: f.entry_year ? Number(f.entry_year) : null,
  };
}

// Ano de ingresso + curso/matriz + meta. O número que vale é o da matriz do ano de ingresso.
export default function CursoFields({ f, setF, inst, idPrefix = 'cf' }) {
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const { course, needsGoal } = cursoEscolhido(inst, f);
  const lista = cursosVisiveis(inst, f.entry_year);
  const catInst = inst?.catalog ? getInstituicao(inst.id) : null;
  const todos = catInst && course?.catalogRef ? alertasDoCurso(catInst, course.catalogRef) : [];
  const alertas = todos.filter((a) => a.nivel === 'alto'); // no cadastro só os graves; o resto fica na ficha
  const outros = todos.length - alertas.length;
  const semFiltro = inst?.catalog && f.entry_year && lista.length === inst.courses.length && !inst.courses.every((c) => matrizCobreAno(c.catalogRef, Number(f.entry_year)));

  return (
    <>
      <Field label="Ano de ingresso" htmlFor={`${idPrefix}-ano`} hint="Vale a matriz do ano em que você entrou no curso: o número de horas muda de uma matriz para outra.">
        <select id={`${idPrefix}-ano`} value={f.entry_year || ''} onChange={set('entry_year')} required>
          <option value="">Escolha</option>
          {ANOS_INGRESSO.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </Field>
      {inst && !inst.custom && (
        <Field label="Curso e matriz" htmlFor={`${idPrefix}-curso`} hint={`Regras: ${inst.source}`}>
          <select id={`${idPrefix}-curso`} value={course?.id || ''} onChange={set('course_id')}>
            {lista.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.goal != null ? `(${c.goal}h)` : c.catalogRef ? '(meta a confirmar)' : ''}
              </option>
            ))}
          </select>
        </Field>
      )}
      {semFiltro && <p className="small muted">Nenhuma matriz do catálogo traz corte para {f.entry_year}; mostrando todas. Confirme a sua com a secretaria.</p>}
      {inst?.catalog && course?.catalogRef && (
        <div className="stack">
          <p className="small">
            O catálogo traz para este curso: <b>{formatHorasCatalogo(course.catalogRef.horas)}</b>.
          </p>
          {alertas.map((a, i) => (
            <div key={i} className={`alert ${a.nivel === 'alto' ? 'alert-error' : 'alert-warn'}`}>
              <Icon name="TriangleAlert" size={18} />
              <span>{a.texto}</span>
            </div>
          ))}
          {outros > 0 && <p className="small muted">Há mais {outros} {outros === 1 ? 'aviso' : 'avisos'} na ficha.</p>}
          <Link to={`/regras/${inst.id}?curso=${encodeURIComponent(course.id)}`} className="link-btn" target="_blank">
            Ver a ficha completa e o PDF oficial
          </Link>
        </div>
      )}
      {inst && !inst.custom && needsGoal && (
        <Field label="Quantas horas complementares seu curso exige?" htmlFor={`${idPrefix}-meta`} hint="O catálogo não tem um número confiável em horas para esta matriz. Confira no regulamento ou na secretaria e digite aqui.">
          <input id={`${idPrefix}-meta`} type="number" min="1" max="2000" inputMode="numeric" value={f.goal_hours || ''} onChange={set('goal_hours')} required />
        </Field>
      )}
    </>
  );
}

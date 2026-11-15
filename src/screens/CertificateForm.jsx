import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { typesFor } from '../lib/rules.js';
import { compressImage, MAX_FILE_MB } from '../lib/image.js';
import { computeProgress, formatHours } from '../lib/progress.js';
import { Button, Field, Icon, Sheet } from '../components/ui.jsx';
import { parseCertificate, titleFromFilename, checkRequirements, CERT_REQUIREMENTS } from '../lib/certParse.js';
import { RequirementsCard } from '../components/certificate.jsx';

const AUTO_FIELDS = [
  ['title', 'nome'],
  ['type_key', 'tipo de atividade'],
  ['hours', 'carga horária'],
  ['issued_on', 'data'],
  ['issuer', 'quem emitiu'],
];

export const CERT_STATUS = [
  { value: 'guardado', label: 'Só guardado no cofre', tone: 'neutral' },
  { value: 'entregue', label: 'Entregue à secretaria/coordenação', tone: 'warn' },
  { value: 'validado', label: 'Validado pela faculdade', tone: 'ok' },
  { value: 'recusado', label: 'Recusado pela faculdade', tone: 'error' },
];

const EMPTY = { title: '', type_key: '', hours: '', issued_on: '', issuer: '', status: 'guardado', notes: '', event_id: null };

export default function CertificateForm({ open, onClose, cert, initial }) {
  const { api, profile, certificates, refreshCertificates, notify } = useStore();
  const [f, setF] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reading, setReading] = useState(null); // { pct, label }
  const [auto, setAuto] = useState(null); // { filled: [...], missing: [...] }
  const [checks, setChecks] = useState(null); // requisitos encontrados no arquivo
  const touched = useRef(new Set());
  const fRef = useRef(f);
  fRef.current = f;
  const readId = useRef(0);
  const types = useMemo(() => typesFor(profile.institution_id, profile.course_id), [profile]);
  const groups = useMemo(() => {
    const g = {};
    for (const t of types) (g[t.group || ''] = g[t.group || ''] || []).push(t);
    return g;
  }, [types]);

  useEffect(() => {
    if (!open) return;
    setF({ ...EMPTY, ...(initial || {}), ...(cert || {}), hours: cert?.hours ?? initial?.hours ?? '' });
    setFile(null);
    setError('');
    setReading(null);
    setAuto(null);
    setChecks(
      Array.isArray(cert?.missing_requirements)
        ? CERT_REQUIREMENTS.map((r) => ({ ...r, ok: r.required ? !cert.missing_requirements.includes(r.key) : null }))
        : null,
    );
    touched.current = new Set(Object.keys(cert || {}).filter((k) => cert[k]));
    readId.current += 1;
  }, [open, cert, initial]);

  const type = types.find((t) => t.key === f.type_key);
  const set = (k) => (e) => {
    touched.current.add(k);
    setAuto((a) => (a ? { ...a, filled: a.filled.filter((x) => x !== k) } : a));
    setF({ ...f, [k]: e.target.value });
  };
  const isAuto = (k) => auto?.filled.includes(k);

  // prévia de quanto vai contar
  const preview = useMemo(() => {
    if (!f.type_key || !Number(f.hours)) return null;
    const others = certificates.filter((c) => c.id !== cert?.id);
    const before = computeProgress(profile, others).counted;
    const after = computeProgress(profile, [...others, { ...f, id: '_new', hours: Number(f.hours), issued_on: f.issued_on || '9999-12-31' }]).counted;
    return after - before;
  }, [f, certificates, cert, profile]);

  async function pick(e) {
    const raw = e.target.files?.[0];
    e.target.value = '';
    if (!raw) return;
    const small = await compressImage(raw);
    if (small.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Arquivo muito grande (máximo ${MAX_FILE_MB} MB).`);
      return;
    }
    setError('');
    setFile(small);
    setAuto(null);
    setChecks(null);
    readFile(raw);
  }

  // lê o arquivo e preenche só os campos que o aluno ainda não mexeu
  async function readFile(raw) {
    const id = ++readId.current;
    setReading({ pct: 0.05, label: 'Abrindo o arquivo' });
    let parsed = {};
    let found = null;
    try {
      const { readCertificateText } = await import('../lib/certReader.js');
      const { text } = await readCertificateText(raw, (pct, label) => id === readId.current && setReading({ pct, label }));
      if (import.meta.env.DEV) window.__lastCertText = text; // ajuda a calibrar a leitura em desenvolvimento
      parsed = parseCertificate(text, { profile });
      if (text.replace(/\s/g, '').length > 20) found = checkRequirements(text, parsed, profile);
    } catch (err) {
      console.warn('Leitura automática falhou', err);
    }
    if (id !== readId.current) return; // trocou de arquivo no meio da leitura
    if (!parsed.title) parsed.title = titleFromFilename(raw.name, profile.name) || null;
    const filled = [];
    const missing = [];
    const prev = fRef.current;
    const next = { ...prev };
    for (const [k] of AUTO_FIELDS) {
      const v = parsed[k];
      if (v === null || v === undefined || v === '') {
        if (!prev[k]) missing.push(k);
        continue;
      }
      if (touched.current.has(k) && prev[k]) continue;
      next[k] = k === 'hours' ? String(v) : v;
      filled.push(k);
    }
    setF(next);
    setReading(null);
    setAuto({ filled, missing });
    setChecks(found);
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    if (!f.title.trim()) return setError('Dê um nome ao certificado.');
    if (!f.type_key) return setError('Escolha o tipo de atividade.');
    const h = Number(String(f.hours).replace(',', '.'));
    if (!(h > 0)) return setError('Informe a carga horária do certificado.');
    setBusy(true);
    try {
      const data = { title: f.title.trim(), type_key: f.type_key, hours: h, issued_on: f.issued_on || null, issuer: f.issuer.trim(), status: f.status, notes: f.notes.trim(), event_id: f.event_id || null };
      if (checks) data.missing_requirements = checks.filter((c) => c.required && c.ok === false).map((c) => c.key);
      if (cert) await api.updateCertificate(cert.id, data, file);
      else await api.createCertificate(data, file);
      await refreshCertificates();
      notify(cert ? 'Certificado atualizado.' : preview > 0 ? `Guardado! +${formatHours(preview)} no seu progresso.` : 'Guardado no cofre.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Apagar este certificado do cofre? O arquivo também será apagado.')) return;
    setBusy(true);
    try {
      await api.deleteCertificate(cert.id);
      await refreshCertificates();
      notify('Certificado apagado.');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={cert ? 'Editar certificado' : 'Guardar certificado'}>
      <form className="stack" onSubmit={save}>
        <label className={`upload ${file || cert?.file_path ? 'upload-done' : ''} ${reading ? 'upload-reading' : ''}`}>
          <input type="file" accept="image/*,application/pdf" onChange={pick} />
          {reading ? <span className="spinner spinner-dark" /> : <Icon name={file || cert?.file_path ? 'FileCheck2' : 'Camera'} size={26} />}
          <div>
            <b>{file ? file.name : cert?.file_path ? cert.file_name || 'Arquivo guardado' : 'Foto ou PDF do certificado'}</b>
            <span>
              {reading
                ? `${reading.label}… ${Math.round(reading.pct * 100)}%`
                : file || cert?.file_path
                  ? 'Toque para trocar o arquivo'
                  : 'Tire uma foto ou escolha um arquivo: a gente lê e preenche para você'}
            </span>
            {reading && (
              <i className="read-bar">
                <i style={{ width: `${Math.round(reading.pct * 100)}%` }} />
              </i>
            )}
          </div>
        </label>

        {auto && (
          <div className={`alert ${auto.filled.length ? 'alert-ok' : 'alert-warn'}`} role="status">
            <Icon name={auto.filled.length ? 'Sparkles' : 'TriangleAlert'} size={18} />
            <span>
              {auto.filled.length ? (
                <>
                  Lemos o certificado e preenchemos {listPt(auto.filled.map(labelOf))}. <b>Confira antes de guardar.</b>
                  {auto.missing.length > 0 && ` Não encontramos ${listPt(auto.missing.map(labelOf))}.`}
                </>
              ) : (
                'Não conseguimos ler os dados deste arquivo. Preencha os campos abaixo.'
              )}
            </span>
          </div>
        )}

        {(file || cert?.file_path) && !reading && <RequirementsCard key={`${file?.name || cert?.id}-${!!checks}`} checks={checks} ielusc={profile.institution_id === 'ielusc'} />}

        <Field label="Nome do certificado" htmlFor="ct">
          <input id="ct" className={isAuto('title') ? 'autofilled' : ''} value={f.title} onChange={set('title')} placeholder="Ex.: Semana Acadêmica de Comunicação" required />
        </Field>

        <Field label="Tipo de atividade" htmlFor="ctype" hint={type?.note || (type?.proof ? `Comprovação: ${type.proof}` : null)}>
          <select id="ctype" className={isAuto('type_key') ? 'autofilled' : ''} value={f.type_key} onChange={set('type_key')} required>
            <option value="">Escolha pela tabela do seu curso</option>
            {Object.entries(groups).map(([g, list]) =>
              g ? (
                <optgroup key={g} label={`Atividades ${g}`}>
                  {list.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.code ? `${t.code} · ` : ''}
                      {t.label}
                      {t.max ? ` (teto ${t.max}h)` : ''}
                    </option>
                  ))}
                </optgroup>
              ) : (
                list.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                    {t.max ? ` (teto ${t.max}h)` : ''}
                  </option>
                ))
              ),
            )}
          </select>
        </Field>

        <div className="grid-2">
          <Field label="Carga horária" htmlFor="ch" hint={type?.per ? `Vale até ${type.per}h por ${type.perUnit}` : null}>
            <div className={`suffix ${isAuto('hours') ? 'autofilled' : ''}`}>
              <input id="ch" type="number" inputMode="decimal" min="0.5" step="0.5" max="2000" value={f.hours} onChange={set('hours')} required />
              <span>horas</span>
            </div>
          </Field>
          <Field label="Data de emissão" htmlFor="cd">
            <input id="cd" className={isAuto('issued_on') ? 'autofilled' : ''} type="date" value={f.issued_on || ''} onChange={set('issued_on')} />
          </Field>
        </div>

        {preview !== null && (
          <div className={`alert ${preview > 0 ? 'alert-ok' : 'alert-warn'}`}>
            <Icon name={preview > 0 ? 'TrendingUp' : 'TriangleAlert'} size={18} />
            {preview > 0 ? (
              <span>
                Vai somar <b>{formatHours(preview)}</b> ao seu progresso{preview < Number(f.hours) ? ` (o resto passa do limite da categoria)` : ''}.
              </span>
            ) : (
              <span>Esse certificado não soma: o teto da categoria ou a meta do curso já foi atingido.</span>
            )}
          </div>
        )}

        <Field label="Quem emitiu" htmlFor="ci">
          <input id="ci" className={isAuto('issuer') ? 'autofilled' : ''} value={f.issuer} onChange={set('issuer')} placeholder="Instituição, empresa ou plataforma" />
        </Field>

        <Field label="Situação" htmlFor="cs">
          <select id="cs" value={f.status} onChange={set('status')}>
            {CERT_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Anotações (opcional)" htmlFor="cn">
          <textarea id="cn" rows={2} value={f.notes} onChange={set('notes')} placeholder="Ex.: entreguei na secretaria dia 10/11" />
        </Field>

        {error && (
          <div className="alert alert-error" role="alert">
            <Icon name="CircleAlert" size={18} /> {error}
          </div>
        )}
        <Button type="submit" block size="lg" loading={busy} disabled={!!reading}>
          {reading ? 'Lendo o certificado…' : cert ? 'Salvar alterações' : 'Guardar no cofre'}
        </Button>
        {cert && (
          <Button type="button" variant="danger" block icon="Trash2" onClick={remove} disabled={busy}>
            Apagar certificado
          </Button>
        )}
      </form>
    </Sheet>
  );
}

function labelOf(k) {
  return AUTO_FIELDS.find(([key]) => key === k)?.[1] || k;
}
function listPt(items) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { EVENT_CATEGORIES, INSTITUTIONS } from '../lib/rules.js';
import { dateInputValue, timeInputValue, toIso, todayYmd, safeUrl } from '../lib/format.js';
import { compressImage } from '../lib/image.js';
import { Button, Chip, Field, Icon } from '../components/ui.jsx';
import { CertificatePreview, PARTICIPATION_OPTIONS, eventCertChecks } from '../components/certificate.jsx';
import { COORDINATOR } from '../lib/seed.js';

const COURSES = INSTITUTIONS[0].courses;

const BLANK = {
  title: '',
  category: 'palestra',
  hours: '',
  start_date: todayYmd(),
  start_time: '19:00',
  end_date: '',
  end_time: '22:00',
  location: '',
  address: '',
  city: 'Joinville',
  paid: false,
  price: '',
  link: '',
  courses: [],
  description: '',
  capacity: '',
  requirements: '',
  image_url: null,
  boost: false,
  cert_issuer: '',
  // padrão: certificado assinado pelo coordenador do curso (pode trocar)
  cert_signer_name: COORDINATOR.name,
  cert_signer_role: COORDINATOR.role,
  cert_participation: 'participou',
  cert_delivery: '',
};

export default function EventForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { api, profile, notify, loadEvents } = useStore();
  const [f, setF] = useState(BLANK);
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!id);
  const isAdmin = profile.role === 'admin';
  useEffect(() => {
    if (!id && profile.org_name) setF((prev) => (prev.cert_issuer ? prev : { ...prev, cert_issuer: profile.org_name }));
  }, [id, profile.org_name]);

  useEffect(() => {
    if (!id) return;
    api.getEvent(id).then((ev) => {
      if (!ev) {
        notify('Evento não encontrado.', 'error');
        nav('/');
        return;
      }
      setF({
        title: ev.title,
        category: ev.category,
        hours: ev.hours,
        start_date: dateInputValue(ev.starts_at),
        start_time: timeInputValue(ev.starts_at),
        end_date: ev.ends_at && dateInputValue(ev.ends_at) !== dateInputValue(ev.starts_at) ? dateInputValue(ev.ends_at) : '',
        end_time: ev.ends_at ? timeInputValue(ev.ends_at) : '',
        location: ev.location || '',
        address: ev.address || '',
        city: ev.city || '',
        paid: Number(ev.price) > 0,
        price: Number(ev.price) > 0 ? ev.price : '',
        link: ev.link || '',
        courses: ev.courses || [],
        description: ev.description || '',
        capacity: ev.capacity ?? '',
        cert_issuer: ev.cert_issuer || '',
        cert_signer_name: ev.cert_signer_name || '',
        cert_signer_role: ev.cert_signer_role || '',
        cert_participation: ev.cert_participation || 'participou',
        cert_delivery: ev.cert_delivery || '',
        requirements: (ev.requirements || []).join('\n'),
        image_url: ev.image_url,
        boost: ev.boost_status !== 'none',
        boost_status: ev.boost_status,
      });
      setPreview(ev.image_url);
      setLoaded(true);
    });
  }, [id, api, nav, notify]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function pickImage(e) {
    const raw = e.target.files?.[0];
    e.target.value = '';
    if (!raw) return;
    const small = await compressImage(raw, 1400, 0.8);
    setImg(small);
    setPreview(URL.createObjectURL(small));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const hours = Number(String(f.hours).replace(',', '.'));
    if (f.title.trim().length < 3) return setError('Dê um título ao evento.');
    if (!(hours > 0)) return setError('Informe quantas horas o certificado vai ter.');
    if (!f.cert_issuer.trim()) return setError('Informe a instituição responsável que aparece no certificado.');
    if (!f.cert_signer_name.trim() || !f.cert_signer_role.trim()) return setError('Informe o nome e o cargo de quem assina o certificado. Sem isso, a faculdade pode recusar as horas.');
    const starts_at = toIso(f.start_date, f.start_time);
    const ends_at = toIso(f.end_date || f.start_date, f.end_time || f.start_time);
    if (new Date(ends_at) < new Date(starts_at)) return setError('O fim precisa ser depois do início.');
    let link = f.link.trim();
    if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;
    if (link && !safeUrl(link)) return setError('O link de inscrição precisa ser um endereço da web (https://…).');
    if (link) link = safeUrl(link);
    setBusy(true);
    try {
      let image_url = f.image_url;
      if (img) image_url = await api.uploadEventImage(img);
      const data = {
        title: f.title.trim(),
        category: f.category,
        hours,
        starts_at,
        ends_at,
        location: f.location.trim(),
        address: f.address.trim(),
        city: f.city.trim(),
        price: f.paid ? Number(String(f.price).replace(',', '.')) || 0 : 0,
        link,
        courses: f.courses,
        description: f.description.trim(),
        capacity: Number(f.capacity) > 0 ? Math.round(Number(f.capacity)) : null,
        requirements: f.requirements.split('\n').map((r) => r.replace(/^[-*•\s]+/, '').trim()).filter(Boolean),
        cert_issuer: f.cert_issuer.trim(),
        cert_signer_name: f.cert_signer_name.trim(),
        cert_signer_role: f.cert_signer_role.trim(),
        cert_participation: f.cert_participation,
        cert_delivery: f.cert_delivery.trim(),
        image_url,
        institution_id: 'ielusc',
      };
      if (!id) data.boost_status = f.boost ? 'requested' : 'none';
      else if (f.boost && f.boost_status === 'none') data.boost_status = 'requested';
      const saved = id ? await api.updateEvent(id, data) : await api.createEvent(data);
      await loadEvents();
      notify(isAdmin ? 'Evento publicado.' : id ? 'Alterações enviadas para revisão.' : 'Evento enviado! Ele aparece na vitrine depois da aprovação.');
      nav(`/evento/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!loaded) return <div className="page center-pad"><span className="spinner spinner-dark" /></div>;
  if (profile.role === 'organizer' && profile.org_status !== 'approved') {
    return (
      <div className="page">
        <p className="alert alert-warn">Seu perfil de organizador ainda está em análise. Assim que for aprovado, você poderá publicar eventos.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => nav(-1)} type="button">
        <Icon name="ChevronLeft" size={18} /> Voltar
      </button>
      <h1 className="top-title">{id ? 'Editar evento' : 'Novo evento'}</h1>
      {!isAdmin && <p className="muted">{id ? 'Ao mudar o conteúdo, o evento volta para revisão antes de reaparecer.' : 'Publicar é gratuito. A equipe revisa antes de o evento entrar na vitrine.'}</p>}

      <form className="stack" onSubmit={submit}>
        <label className="img-pick" style={preview ? { backgroundImage: `url(${preview})` } : undefined}>
          <input type="file" accept="image/*" onChange={pickImage} />
          {!preview && (
            <span>
              <Icon name="ImagePlus" size={28} />
              Capa do evento (opcional)
            </span>
          )}
          {preview && <span className="img-pick-change">Trocar capa</span>}
        </label>

        <Field label="Título" htmlFor="et">
          <input id="et" value={f.title} onChange={set('title')} maxLength={140} required />
        </Field>

        <Field label="Categoria">
          <div className="chips chips-wrap">
            {EVENT_CATEGORIES.map((c) => (
              <Chip key={c.id} icon={c.icon} active={f.category === c.id} onClick={() => setF({ ...f, category: c.id })}>
                {c.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Horas no certificado" htmlFor="eh" hint="É o número que os alunos mais procuram. Informe a carga que vai sair no certificado.">
          <div className="suffix">
            <input id="eh" type="number" inputMode="decimal" min="0.5" step="0.5" max="2000" value={f.hours} onChange={set('hours')} required />
            <span>horas</span>
          </div>
        </Field>

        <div className="grid-2">
          <Field label="Começa em" htmlFor="sd">
            <input id="sd" type="date" value={f.start_date} onChange={set('start_date')} required />
          </Field>
          <Field label="Horário" htmlFor="st">
            <input id="st" type="time" value={f.start_time} onChange={set('start_time')} required />
          </Field>
          <Field label="Termina em" htmlFor="ed" hint="Deixe vazio se for no mesmo dia.">
            <input id="ed" type="date" value={f.end_date} min={f.start_date} onChange={set('end_date')} />
          </Field>
          <Field label="Até" htmlFor="eti">
            <input id="eti" type="time" value={f.end_time} onChange={set('end_time')} />
          </Field>
        </div>

        <Field label="Local" htmlFor="el" hint='Ex.: "Auditório do Bloco A" ou "Online"'>
          <input id="el" value={f.location} onChange={set('location')} required />
        </Field>
        <div className="grid-2">
          <Field label="Endereço" htmlFor="ea">
            <input id="ea" value={f.address} onChange={set('address')} placeholder="Rua, número, bairro" />
          </Field>
          <Field label="Cidade" htmlFor="ec">
            <input id="ec" value={f.city} onChange={set('city')} />
          </Field>
        </div>

        <label className="check">
          <input type="checkbox" checked={f.paid} onChange={set('paid')} />
          <span>Evento pago</span>
        </label>
        {f.paid && (
          <Field label="Valor do ingresso" htmlFor="ep">
            <div className="suffix suffix-left">
              <span>R$</span>
              <input id="ep" type="number" inputMode="decimal" min="0" step="0.01" value={f.price} onChange={set('price')} required />
            </div>
          </Field>
        )}

        <Field label="Link de inscrição ou ingresso" htmlFor="eli" hint="Sympla, formulário, site… Contamos quantos alunos clicam.">
          <input id="eli" type="url" inputMode="url" value={f.link} onChange={set('link')} placeholder="https://" />
        </Field>

        <Field label="Para quais cursos? (deixe vazio para todos)">
          <div className="chips chips-wrap">
            {COURSES.map((c) => (
              <Chip
                key={c.id}
                active={f.courses.includes(c.id)}
                onClick={() => setF({ ...f, courses: f.courses.includes(c.id) ? f.courses.filter((x) => x !== c.id) : [...f.courses, c.id] })}
              >
                {c.name}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Vagas (opcional)" htmlFor="ecap" hint="Deixe vazio se não houver limite.">
          <input id="ecap" type="number" inputMode="numeric" min="1" max="100000" value={f.capacity} onChange={set('capacity')} />
        </Field>

        <Field label="Pré-requisitos (opcional)" htmlFor="ereq" hint="Um por linha. Ex.: levar notebook, enviar arquivo antes.">
          <textarea id="ereq" rows={3} value={f.requirements} onChange={set('requirements')} />
        </Field>

        <Field label="Descrição" htmlFor="ede">
          <textarea id="ede" rows={5} value={f.description} onChange={set('description')} maxLength={5000} placeholder="Programação, palestrantes, como sai o certificado…" />
        </Field>

        <section className="form-section">
          <h2>
            <Icon name="BadgeCheck" size={20} /> Certificado
          </h2>
          <p>Para as horas serem aceitas pela faculdade, o certificado precisa trazer os itens abaixo. Usamos como modelo o certificado do 8º Comunicathon (IELUSC).</p>

          <Field label="Instituição responsável" htmlFor="cis" hint='Aparece como "promovido por". Ex.: Faculdade IELUSC, APP Brasil.'>
            <input id="cis" value={f.cert_issuer} onChange={set('cert_issuer')} required />
          </Field>
          <div className="grid-2">
            <Field label="Quem assina (com titulação)" htmlFor="csn" hint="Ex.: Prof. Me. Vinicios Neves">
              <input id="csn" value={f.cert_signer_name} onChange={set('cert_signer_name')} required />
            </Field>
            <Field label="Cargo de quem assina" htmlFor="csr" hint="Ex.: Coordenador do Curso de PP">
              <input id="csr" value={f.cert_signer_role} onChange={set('cert_signer_role')} required />
            </Field>
          </div>
          <Field label="O certificado vai dizer que a pessoa…" htmlFor="cpt">
            <select id="cpt" value={f.cert_participation} onChange={set('cert_participation')}>
              {PARTICIPATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Como e quando o certificado é entregue (opcional)" htmlFor="cdl" hint="Ex.: por e-mail em até 15 dias, mediante lista de presença.">
            <input id="cdl" value={f.cert_delivery} onChange={set('cert_delivery')} />
          </Field>

          <ul className="org-checks" aria-label="Itens do certificado">
            {eventCertChecks({ ...f, starts_at: f.start_date }).map((c) => (
              <li key={c.key} className={c.ok ? 'is-ok' : 'is-miss'}>
                <Icon name={c.ok ? 'CircleCheck' : 'Circle'} size={17} />
                <span>
                  {c.label} {c.note && <small>· {c.note}</small>}
                </span>
              </li>
            ))}
            <li className="is-miss">
              <Icon name="Circle" size={17} />
              <span>
                Código ou QR de verificação <small>· recomendado</small>
              </span>
            </li>
          </ul>

          <span className="field-label">Prévia do certificado</span>
          <CertificatePreview
            event={{
              ...f,
              hours: Number(String(f.hours).replace(',', '.')) || 0,
              starts_at: f.start_date ? toIso(f.start_date, f.start_time) : null,
              ends_at: toIso(f.end_date || f.start_date, f.end_time || f.start_time),
            }}
          />
        </section>

        {!isAdmin && (!id || f.boost_status === 'none') && (
          <label className="check check-card">
            <input type="checkbox" checked={f.boost} onChange={set('boost')} />
            <span>
              <b>Quero impulsionar este evento</b>
              <br />
              Ele aparece no carrossel “Em alta”. A equipe entra em contato para combinar.
            </span>
          </label>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <Icon name="CircleAlert" size={18} /> {error}
          </div>
        )}
        <Button type="submit" block size="lg" loading={busy}>
          {id ? 'Salvar evento' : isAdmin ? 'Publicar evento' : 'Enviar para aprovação'}
        </Button>
      </form>
    </div>
  );
}

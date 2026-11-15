import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { isDemo } from '../lib/backend/index.js';
import { DEMO_ACCOUNTS } from '../lib/seed.js';
import { Button, Field, Icon, Logo, Segmented } from '../components/ui.jsx';
import { InstallButton } from '../components/InstallApp.jsx';

export default function Auth() {
  const { api, notify } = useStore();
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '', birth: '', terms: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (form.name.trim().length < 2) return setError('Digite seu nome.');
      if (!form.terms) return setError('Para criar a conta, aceite os termos e a política de privacidade.');
      if (!birthPassword(form.birth)) return setError('Confira a data de nascimento.');
    }
    setBusy(true);
    try {
      // a primeira senha é a data de nascimento (DDMMAAAA); no primeiro acesso o app obriga a criar outra
      if (mode === 'signup') await api.signUp({ email: form.email, password: birthPassword(form.birth), name: form.name.trim() });
      else await api.signIn({ email: form.email, password: form.password });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    if (!form.email) return setError('Digite seu e-mail acima e toque de novo em "Esqueci a senha".');
    try {
      await api.resetPassword(form.email);
      notify('Enviamos um link para redefinir a senha.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function quick(acc) {
    setBusy(true);
    try {
      await api.signIn(acc);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <section className="auth-hero">
        <Logo height={150} />
        <p className="auth-tag">
          <b>Hub</b> de <b>eficiência</b> acadêmico
        </p>
        <ul className="auth-points">
          <li>
            <Icon name="ShieldCheck" size={18} /> Seus certificados guardados num só lugar
          </li>
          <li>
            <Icon name="ChartNoAxesColumnIncreasing" size={18} /> Quanto falta, categoria por categoria, pela tabela do seu curso
          </li>
          <li>
            <Icon name="Sparkles" size={18} /> Eventos que valem horas, perto de você
          </li>
        </ul>
      </section>

      <section className="auth-card">
        <Segmented
          value={mode}
          onChange={(m) => {
            setMode(m);
            setError('');
          }}
          options={[
            { value: 'signup', label: 'Criar conta' },
            { value: 'login', label: 'Entrar' },
          ]}
        />
        <form onSubmit={submit} className="stack">
          {mode === 'signup' && (
            <Field label="Seu nome" htmlFor="name">
              <input id="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Como você quer ser chamado" required />
            </Field>
          )}
          <Field label="E-mail" htmlFor="email">
            <input id="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="voce@email.com" required />
          </Field>
          {mode === 'signup' ? (
            <Field label="Data de nascimento" htmlFor="birth" hint="Ela é a sua senha só no primeiro acesso. Logo depois você cria uma senha nova.">
              <input id="birth" type="date" autoComplete="bday" value={form.birth} onChange={set('birth')} min="1930-01-01" max={maxBirth()} required />
            </Field>
          ) : (
            <Field label="Senha" htmlFor="password" hint="Primeiro acesso? Use sua data de nascimento, só números (ex.: 07031999).">
              <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={set('password')} minLength={6} required />
            </Field>
          )}
          {mode === 'signup' && (
            <label className="check">
              <input type="checkbox" checked={form.terms} onChange={set('terms')} />
              <span>
                Li e aceito os <Link to="/termos">termos de uso</Link> e a <Link to="/privacidade">política de privacidade</Link>.
              </span>
            </label>
          )}
          {error && (
            <div className="alert alert-error" role="alert">
              <Icon name="CircleAlert" size={18} /> {error}
            </div>
          )}
          <Button type="submit" block size="lg" loading={busy}>
            {mode === 'signup' ? 'Criar minha conta' : 'Entrar'}
          </Button>
          {mode === 'login' && (
            <button type="button" className="link-btn" onClick={forgot}>
              Esqueci a senha
            </button>
          )}
        </form>

        <InstallButton variant="link" />

        <Link to="/explorar" className="guest-link">
          <Icon name="Eye" size={16} /> Ver os eventos antes de criar conta
        </Link>

        {isDemo && (
          <div className="demo-box">
            <p>
              <b>Contas de teste</b> (modo demonstração)
            </p>
            <div className="demo-btns">
              {DEMO_ACCOUNTS.map((a) => (
                <button key={a.email} type="button" className="chip" onClick={() => quick(a)} disabled={busy}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// AAAA-MM-DD → DDMMAAAA (aceita entre 12 e 95 anos)
function birthPassword(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return null;
  const age = (Date.now() - new Date(`${iso}T12:00:00`).getTime()) / (365.25 * 86400000);
  if (!(age >= 12 && age <= 95)) return null;
  return `${m[3]}${m[2]}${m[1]}`;
}
function maxBirth() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 12);
  return d.toISOString().slice(0, 10);
}

import { useEffect, useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { Button, Field, Icon, Logo } from '../components/ui.jsx';
import { isStrongPassword } from './NewPassword.jsx';

const WAIT = 60; // segundos entre um envio e outro (o Supabase recusa pedidos seguidos)

// Redefinir senha em 2 passos, sem depender do link do e-mail:
// 1) a pessoa digita o e-mail e recebe um código;
// 2) digita o código + a senha nova, tudo nesta tela.
// O código só é conferido quando ela salva a senha nova, então antivírus de e-mail que
// "abre" links sozinho não queima nada. Também aceita o botão do e-mail (token_hash) e o
// link antigo (sessão de recuperação já aberta pelo Supabase).
export default function ResetPassword() {
  const { api, recovery, setRecovery, refreshProfile, notify } = useStore();
  const viaLink = Boolean(recovery?.tokenHash);
  const [verified, setVerified] = useState(Boolean(recovery?.verified));
  const [step, setStep] = useState(verified || viaLink ? 'password' : 'email');
  const [email, setEmail] = useState(recovery?.email || '');
  const [code, setCode] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(recovery?.error || '');
  const [sentAt, setSentAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  // sessão de recuperação aberta pelo Supabase (link antigo ou depois do verifyOtp)
  useEffect(() => {
    if (recovery?.verified && !verified) {
      setVerified(true);
      setStep('password');
    }
  }, [recovery?.verified, verified]);

  useEffect(() => {
    if (!sentAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [sentAt]);
  const wait = sentAt ? Math.max(0, WAIT - Math.floor((now - sentAt) / 1000)) : 0;

  async function send(e) {
    e?.preventDefault();
    setError('');
    const clean = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(clean)) return setError('Digite o e-mail da sua conta.');
    if (wait) return;
    setBusy(true);
    try {
      await api.sendResetCode(clean);
      setEmail(clean);
      setSentAt(Date.now());
      setNow(Date.now());
      setCode('');
      setStep('code');
      notify('Código enviado. Confira o e-mail (e a caixa de spam).');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    const digits = code.replace(/\D/g, '');
    if (step === 'code' && !verified && (digits.length < 6 || digits.length > 10)) return setError('Digite o código que chegou no e-mail (só os números).');
    if (!isStrongPassword(pw)) return setError('A senha precisa ter pelo menos 8 caracteres, com letras e números.');
    if (pw !== pw2) return setError('As duas senhas não são iguais.');
    setBusy(true);
    try {
      if (!verified) {
        if (viaLink) await api.verifyResetLink(recovery.tokenHash);
        else await api.verifyResetCode({ email, code: digits });
        setVerified(true); // se a troca falhar, a próxima tentativa não confere o código de novo
      }
      await api.updatePassword(pw);
      // quem esqueceu a data de nascimento do 1º acesso também sai daqui com senha própria
      try {
        await api.saveMyProfile({ password_set: true });
      } catch {
        /* perfil ainda carregando: a senha já foi trocada, segue */
      }
      await refreshProfile().catch(() => {});
      notify('Senha nova salva! Você já está dentro.');
      setRecovery(null);
    } catch (err) {
      setError(err.message);
      // link vencido: oferece o caminho do código
      if (viaLink && !verified) setStep('email');
    } finally {
      setBusy(false);
    }
  }

  async function back() {
    // verificou mas desistiu da senha nova: não deixa a sessão de recuperação aberta
    if (verified) await api.signOut().catch(() => {});
    setRecovery(null);
  }

  const passwordFields = (
    <>
      <Field label="Nova senha" htmlFor="rp-pw" hint="Pelo menos 8 caracteres, com letras e números.">
        <input id="rp-pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required />
      </Field>
      <Field label="Repita a senha" htmlFor="rp-pw2">
        <input id="rp-pw2" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} minLength={8} required />
      </Field>
    </>
  );

  const alert = error && (
    <div className="alert alert-error" role="alert">
      <Icon name="CircleAlert" size={18} /> <span>{error}</span>
    </div>
  );

  return (
    <div className="auth reset">
      <section className="auth-hero">
        <Logo height={120} />
      </section>

      <section className="auth-card">
        <div className="reset-head">
          <span className="reset-icon">
            <Icon name={step === 'email' ? 'Mail' : step === 'code' ? 'KeyRound' : 'LockKeyhole'} size={22} />
          </span>
          <div>
            <h1>{step === 'email' ? 'Redefinir senha' : step === 'code' ? 'Digite o código' : 'Crie uma senha nova'}</h1>
            <p className="muted small">
              {step === 'email' && 'Mandamos um código para o seu e-mail. Você digita aqui mesmo, sem precisar abrir link.'}
              {step === 'code' && (
                <>
                  Enviamos para <b>{email}</b>. Vale só o código do <b>último</b> e-mail.
                </>
              )}
              {step === 'password' && 'Escolha a senha que você vai usar para entrar daqui pra frente.'}
            </p>
          </div>
        </div>

        {step === 'email' && <Steps at={1} />}
        {step === 'code' && <Steps at={2} />}

        {step === 'email' && (
          <form className="stack" onSubmit={send}>
            {alert}
            <Field label="E-mail da conta" htmlFor="rp-email">
              <input
                id="rp-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="matricula@suafaculdade.edu.br"
                required
                autoFocus
              />
            </Field>
            <Button type="submit" block size="lg" loading={busy} disabled={wait > 0}>
              {wait > 0 ? `Enviar de novo em ${wait}s` : 'Enviar código'}
            </Button>
            {/* quem saiu do app para abrir o e-mail e voltou: não precisa pedir outro código */}
            <button
              type="button"
              className="link-btn center-link"
              onClick={() => {
                setError('');
                if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError('Digite o e-mail da conta e toque de novo em "Já tenho um código".');
                setEmail(email.trim().toLowerCase());
                setStep('code');
              }}
            >
              Já tenho um código
            </button>
          </form>
        )}

        {step === 'code' && (
          <form className="stack" onSubmit={save}>
            <Field label="Código do e-mail" htmlFor="rp-code">
              <input
                id="rp-code"
                className="code-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]*"
                maxLength={12}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, ''))}
                placeholder="000000"
                required
                autoFocus
              />
            </Field>
            {passwordFields}
            {alert}
            <Button type="submit" block size="lg" loading={busy}>
              Salvar nova senha
            </Button>
            <div className="reset-links">
              <button type="button" className="link-btn" onClick={send} disabled={wait > 0 || busy}>
                {wait > 0 ? `Reenviar em ${wait}s` : 'Reenviar código'}
              </button>
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setError('');
                  setStep('email');
                }}
              >
                Trocar e-mail
              </button>
            </div>
            <p className="muted small reset-tip">
              <Icon name="Info" size={14} /> Não chegou? Olhe o spam e a aba Promoções. O e-mail vem do Àquelas Horas (Supabase).
            </p>
          </form>
        )}

        {step === 'password' && (
          <form className="stack" onSubmit={save}>
            {passwordFields}
            {alert}
            <Button type="submit" block size="lg" loading={busy}>
              Salvar nova senha
            </Button>
          </form>
        )}

        <button type="button" className="guest-link link-reset" onClick={back}>
          <Icon name="ArrowLeft" size={16} /> Voltar para entrar
        </button>
      </section>
    </div>
  );
}

function Steps({ at }) {
  return (
    <ol className="reset-steps" aria-label={`Passo ${at} de 2`}>
      <li className={at >= 1 ? 'on' : ''}>E-mail</li>
      <li className={at >= 2 ? 'on' : ''}>Código e senha nova</li>
    </ol>
  );
}

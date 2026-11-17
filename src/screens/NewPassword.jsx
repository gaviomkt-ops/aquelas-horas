import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { Button, Field, Icon, Logo, Sheet } from '../components/ui.jsx';

export function isStrongPassword(pw) {
  return pw.length >= 8 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);
}

// Formulário de senha nova. Exige letras e números: assim ninguém fica com a data de nascimento
// (só números) como senha definitiva.
function PasswordForm({ submitLabel = 'Salvar nova senha', onDone }) {
  const { api, profile, refreshProfile, notify } = useStore();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!isStrongPassword(pw)) return setError('A senha precisa ter pelo menos 8 caracteres, com letras e números.');
    if (pw !== pw2) return setError('As duas senhas não são iguais.');
    setBusy(true);
    try {
      await api.updatePassword(pw);
      if (profile && !profile.password_set) await api.saveMyProfile({ password_set: true });
      await refreshProfile();
      notify('Senha alterada!');
      onDone?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={submit}>
      <Field label="Nova senha" htmlFor="np" hint="Pelo menos 8 caracteres, com letras e números.">
        <input id="np" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required />
      </Field>
      <Field label="Repita a senha" htmlFor="np2">
        <input id="np2" type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} minLength={8} required />
      </Field>
      {error && (
        <div className="alert alert-error" role="alert">
          <Icon name="CircleAlert" size={18} /> {error}
        </div>
      )}
      <Button type="submit" block size="lg" loading={busy}>
        {submitLabel}
      </Button>
    </form>
  );
}

// Tela cheia do primeiro acesso (senha = data de nascimento). "Esqueci a senha" fica em ResetPassword.jsx.
export default function NewPassword({ firstAccess }) {
  const { profile } = useStore();
  return (
    <div className="onb">
      <Logo height={84} />
      {firstAccess ? (
        <>
          <h1>Oi, {profile?.name?.split(' ')[0]}! Crie sua senha</h1>
          <p className="muted">
            Você entrou com a sua data de nascimento. Para proteger seus certificados, crie agora uma senha só sua. Depois disso a data de nascimento deixa de funcionar.
          </p>
        </>
      ) : (
        <h1>Crie uma senha nova</h1>
      )}
      <PasswordForm submitLabel={firstAccess ? 'Criar senha e continuar' : 'Salvar nova senha'} />
    </div>
  );
}

// Folha para trocar a senha pelo Perfil.
export function ChangePasswordSheet({ open, onClose }) {
  return (
    <Sheet open={open} onClose={onClose} title="Trocar senha">
      <PasswordForm onDone={onClose} />
    </Sheet>
  );
}

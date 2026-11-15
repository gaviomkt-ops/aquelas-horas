import { useState } from 'react';
import { useStore } from '../lib/store.jsx';
import { Button, Field, Icon, Logo } from '../components/ui.jsx';

// Tela aberta pelo link de "esqueci a senha" enviado por e-mail.
export default function NewPassword() {
  const { api, setRecovery, notify } = useStore();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) return setError('A senha precisa ter pelo menos 8 caracteres, com letras e números.');
    if (pw !== pw2) return setError('As duas senhas não são iguais.');
    setBusy(true);
    try {
      await api.updatePassword(pw);
      setRecovery(false);
      notify('Senha alterada!');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="onb">
      <Logo height={84} />
      <h1>Crie uma senha nova</h1>
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
          Salvar nova senha
        </Button>
      </form>
    </div>
  );
}

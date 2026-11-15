import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store.jsx';
import { getInstitution } from '../lib/rules.js';
import { temSecretaria } from '../lib/secretaria.js';
import { Badge, Button, Field, Icon } from './ui.jsx';

// Autorização do aluno para a secretaria da faculdade ver os certificados enviados (LGPD: opcional, revogável).
export default function SecretariaConsent() {
  const { api, profile, refreshProfile, notify } = useStore();
  const [f, setF] = useState({ student_number: profile.student_number || '', class_group: profile.class_group || '', ok: false });
  const [busy, setBusy] = useState(false);
  if (profile.role !== 'student' || !temSecretaria(profile.institution_id)) return null;
  const inst = getInstitution(profile.institution_id);
  const ativo = !!profile.secretaria_consent_at;

  async function salvar(autorizar) {
    if (autorizar && !ativo && !f.ok) return notify('Marque a caixa de autorização para continuar.', 'error');
    setBusy(true);
    try {
      await api.saveMyProfile({
        student_number: f.student_number.trim() || null,
        class_group: f.class_group.trim() || null,
        secretaria_consent_at: autorizar ? new Date().toISOString() : null,
      });
      await refreshProfile();
      notify(autorizar ? 'Pronto: a secretaria já vê os certificados que você marcar como entregues.' : 'Autorização revogada. A secretaria não vê mais seus certificados.');
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card-pad stack sec-consent">
      <div className="row-between">
        <b>
          <Icon name="ShieldCheck" size={18} /> Secretaria Acadêmica · {inst.name}
        </b>
        <Badge tone={ativo ? 'ok' : 'neutral'}>{ativo ? 'Autorizado' : 'Desligado'}</Badge>
      </div>
      <p className="small">
        Se você autorizar, a Secretaria Acadêmica ({inst.name}) vê <b>seu nome, e-mail, curso, ano de ingresso, turma, matrícula</b> e os certificados que você marcar como <b>"Entregue à secretaria/coordenação"</b> (com o arquivo). Certificados só guardados no cofre continuam só seus. A secretaria pode validar ou recusar e exportar planilhas. Você pode revogar quando quiser.
      </p>
      <div className="sec-grid">
        <Field label="Matrícula (opcional)" htmlFor="sc-mat">
          <input id="sc-mat" value={f.student_number} onChange={(e) => setF({ ...f, student_number: e.target.value })} maxLength={30} inputMode="numeric" />
        </Field>
        <Field label="Turma (opcional)" htmlFor="sc-turma" hint="Ex.: PP 2024/1">
          <input id="sc-turma" value={f.class_group} onChange={(e) => setF({ ...f, class_group: e.target.value })} maxLength={40} />
        </Field>
      </div>
      {!ativo ? (
        <>
          <label className="check">
            <input type="checkbox" checked={f.ok} onChange={(e) => setF({ ...f, ok: e.target.checked })} />
            <span>
              Autorizo o compartilhamento desses dados com a Secretaria Acadêmica ({inst.name}), nos termos da <Link to="/privacidade">política de privacidade</Link>.
            </span>
          </label>
          <Button onClick={() => salvar(true)} loading={busy} block>
            Autorizar
          </Button>
        </>
      ) : (
        <div className="rg-acoes">
          <Button variant="soft" size="sm" onClick={() => salvar(true)} loading={busy}>
            Salvar matrícula e turma
          </Button>
          <Button variant="ghost" size="sm" onClick={() => salvar(false)} loading={busy}>
            Revogar autorização
          </Button>
        </div>
      )}
    </section>
  );
}

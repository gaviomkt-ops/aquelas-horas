import { useEffect, useState } from 'react';
import { Button, Icon, Sheet } from './ui.jsx';
import { canPrompt, isInstalled, onInstallChange, platform, promptInstall } from '../lib/install.js';

function useInstallState() {
  const [, force] = useState(0);
  useEffect(() => onInstallChange(() => force((n) => n + 1)), []);
  return { installed: isInstalled(), canPrompt: canPrompt(), ...platform() };
}

// Botão "Instalar o app". variant: 'card' (destaque), 'menu' (linha do perfil) ou 'link'.
export function InstallButton({ variant = 'card' }) {
  const st = useInstallState();
  const [open, setOpen] = useState(false);
  if (st.installed) return null;

  async function onClick() {
    if (st.canPrompt) {
      const ok = await promptInstall();
      if (ok) return;
    }
    setOpen(true);
  }

  const trigger =
    variant === 'menu' ? (
      <button className="menu-item" onClick={onClick} type="button">
        <Icon name="Smartphone" /> <span>Instalar o app no celular</span> <Icon name="ChevronRight" size={18} />
      </button>
    ) : variant === 'link' ? (
      <button className="guest-link link-reset" onClick={onClick} type="button">
        <Icon name="Smartphone" size={16} /> Instalar o app no celular
      </button>
    ) : (
      <button className="install-card" onClick={onClick} type="button">
        <span className="install-ic">
          <Icon name="Smartphone" size={22} />
        </span>
        <span className="install-text">
          <b>Instale o Àquelas Horas</b>
          <small>Ícone na tela inicial, abre em tela cheia. Grátis e sem loja.</small>
        </span>
        <Icon name="Download" size={20} />
      </button>
    );

  return (
    <>
      {trigger}
      <InstallSheet open={open} onClose={() => setOpen(false)} st={st} />
    </>
  );
}

function InstallSheet({ open, onClose, st }) {
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* sem permissão de cópia */
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="Instalar o app">
      {st.inApp ? (
        <div className="stack">
          <p className="alert alert-warn">
            <Icon name="TriangleAlert" size={18} />
            <span>
              Você abriu o link dentro de outro app (Instagram, WhatsApp…). Por lá não dá para instalar. Abra no {st.ios ? 'Safari' : 'Chrome'} primeiro.
            </span>
          </p>
          <ol className="install-steps">
            <li>
              Toque em <Icon name="EllipsisVertical" size={16} /> ou <Icon name="Compass" size={16} /> no canto da tela e escolha <b>Abrir no navegador</b>.
            </li>
            <li>Ou copie o link e cole no {st.ios ? 'Safari' : 'Chrome'}.</li>
          </ol>
          <Button variant="ghost" block icon="Copy" onClick={copy}>
            {copied ? 'Link copiado!' : 'Copiar link'}
          </Button>
        </div>
      ) : st.ios ? (
        <div className="stack">
          {!st.iosSafari && <p className="alert alert-warn">No iPhone, a instalação funciona pelo Safari. Abra este link no Safari.</p>}
          <ol className="install-steps">
            <li>
              Toque no botão <b>Compartilhar</b> <Icon name="Share" size={16} /> na barra do Safari (embaixo ou em cima da tela).
            </li>
            <li>
              Role a lista e toque em <b>Adicionar à Tela de Início</b> <Icon name="SquarePlus" size={16} />.
            </li>
            <li>
              Toque em <b>Adicionar</b>. O ícone do Àquelas Horas aparece junto dos seus apps.
            </li>
          </ol>
        </div>
      ) : (
        <div className="stack">
          <ol className="install-steps">
            <li>
              No Chrome, toque no menu <Icon name="EllipsisVertical" size={16} /> no canto de cima.
            </li>
            <li>
              Toque em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.
            </li>
            <li>Confirme. O ícone do Àquelas Horas aparece junto dos seus apps.</li>
          </ol>
          {!st.android && <p className="muted small">No computador, o Chrome e o Edge mostram um ícone de instalar na barra de endereço.</p>}
        </div>
      )}
    </Sheet>
  );
}

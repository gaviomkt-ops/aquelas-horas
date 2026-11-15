import { useEffect } from 'react';
import { ICONS as L } from './icons.js';
import { eventCategory } from '../lib/rules.js';
import { initials } from '../lib/format.js';
import { useStore } from '../lib/store.jsx';

export function Icon({ name, size = 20, ...rest }) {
  const C = L[name] || L.Circle;
  return <C size={size} strokeWidth={2} aria-hidden="true" {...rest} />;
}

export function Button({ children, variant = 'primary', size, block, icon, loading, className = '', ...rest }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', block ? 'btn-block' : '', className].join(' ');
  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className="spinner" /> : icon ? <Icon name={icon} size={18} /> : null}
      {children && <span>{children}</span>}
    </button>
  );
}

export function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div className="field">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <div className="field-hint">{hint}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

export function Sheet({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`sheet ${wide ? 'sheet-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <Icon name="X" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function Toast() {
  const { toast, setToast } = useStore();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.tone === 'error' ? 5000 : 3000);
    return () => clearTimeout(t);
  }, [toast, setToast]);
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.tone}`} role="status" onClick={() => setToast(null)}>
      <Icon name={toast.tone === 'error' ? 'CircleAlert' : 'CircleCheck'} size={18} />
      <span>{toast.message}</span>
    </div>
  );
}

export function Empty({ icon = 'Inbox', title, text, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

export function Bar({ value, max, tone = 'brand', thin }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`bar ${thin ? 'bar-thin' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={max || 0} aria-valuenow={value}>
      <div className={`bar-fill bar-${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Ring({ pct, size = 112, stroke = 12, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, pct)) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

export function Chip({ active, icon, children, ...rest }) {
  return (
    <button type="button" className={`chip ${active ? 'chip-active' : ''}`} aria-pressed={!!active} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </button>
  );
}

export function Badge({ tone = 'neutral', children, icon }) {
  return (
    <span className={`badge badge-${tone}`}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

export function Avatar({ name, size = 36 }) {
  let h = 0;
  for (const ch of name || '') h = (h * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span className="avatar" style={{ width: size, height: size, background: `hsl(${h} 70% 92%)`, color: `hsl(${h} 55% 32%)`, fontSize: size * 0.38 }}>
      {initials(name)}
    </span>
  );
}

export function EventCover({ event, className = '' }) {
  const cat = eventCategory(event.category);
  if (event.image_url) {
    return <img className={`cover ${className}`} src={event.image_url} alt="" loading="lazy" />;
  }
  return (
    <div className={`cover cover-fallback ${className}`} style={{ '--cat': cat.color }}>
      <Icon name={cat.icon} size={40} />
    </div>
  );
}

export function Logo({ height = 56 }) {
  // o PNG tem fundo branco; multiply deixa o fundo invisível sobre o bege do app
  return <img src="./logo.png" alt="Àquelas Horas" style={{ height, width: 'auto', maxWidth: '100%', objectFit: 'contain', objectPosition: 'left center', mixBlendMode: 'multiply' }} />;
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)} type="button">
          {o.label}
          {o.count != null && <span className="seg-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

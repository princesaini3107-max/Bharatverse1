import { Link } from 'react-router-dom';

// ---- Buttons ----
export function Button({ variant = 'primary', as, to, className = '', children, ...props }) {
  const cls = `btn-${variant} ${className}`;
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>;
  const Tag = as || 'button';
  return <Tag className={cls} {...props}>{children}</Tag>;
}

// ---- Badge / chip ----
export function Badge({ children, tone = 'sand', className = '' }) {
  const tones = {
    sand: 'bg-sand-100 text-ink-soft',
    saffron: 'bg-saffron-100 text-saffron-700',
    peacock: 'bg-peacock-100 text-peacock-600',
    rose: 'bg-rose-heritage/10 text-rose-heritage',
    ink: 'bg-ink text-white',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone] || tones.sand} ${className}`}>
      {children}
    </span>
  );
}

// ---- Section heading (eyebrow + title + optional link) ----
export function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1 text-sm font-semibold uppercase tracking-wide text-saffron-600">{eyebrow}</div>}
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---- Loading / empty / error states ----
export function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-soft">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-saffron-300 border-t-saffron-600" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      <div className="text-4xl">🪷</div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {message && <p className="max-w-md text-ink-soft">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="card flex flex-col items-center gap-3 border-rose-heritage/30 p-10 text-center">
      <div className="text-3xl">⚠️</div>
      <p className="max-w-md text-ink-soft">{message}</p>
      {onRetry && <Button variant="ghost" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

// ---- Tabs ----
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-sand-200">
      {tabs.map((t) => {
        const val = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        const on = val === active;
        return (
          <button
            key={val}
            onClick={() => onChange(val)}
            className={`-mb-px rounded-t-lg border-b-2 px-4 py-2 text-sm font-semibold transition ${
              on ? 'border-saffron-500 text-saffron-700' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ---- Modal ----
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative z-10 w-full max-w-lg p-6 fade-up" role="dialog" aria-modal="true">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-ink-soft hover:bg-sand-100" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

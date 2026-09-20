import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth.jsx';

const LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/culture', label: 'Culture' },
  { to: '/museum', label: 'Museum' },
  { to: '/artisans', label: 'Artisans' },
  { to: '/heritage-at-risk', label: 'At Risk' },
  { to: '/learn', label: 'Learn' },
  { to: '/marketplace', label: 'Marketplace' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="#1E1B3A" />
        <path d="M20 7 l3 6 6 .8 -4.5 4.2 1.2 6.2 -5.7-3.1 -5.7 3.1 1.2-6.2 -4.5-4.2 6-.8z" fill="#E4841B" />
        <circle cx="20" cy="20" r="3.2" fill="#0E9C86" />
      </svg>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold text-ink">BharatVerse</div>
        <div className="-mt-1 text-[10px] font-medium uppercase tracking-widest text-saffron-600">Living Heritage</div>
      </div>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardLink =
    user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor/dashboard' : '/dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/85 backdrop-blur">
      <div className="container-bv flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-white text-saffron-700 shadow-card' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/guide" className="btn-ghost">AI Guide</Link>
          <Link to="/planner" className="btn-peacock">Plan a trip</Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to={dashboardLink} className="btn-ink">{user.name.split(' ')[0]}</Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-ink-soft hover:text-ink" aria-label="Log out">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="btn-ink">Sign in</Link>
          )}
        </div>
        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-sand-200 bg-white lg:hidden">
          <div className="container-bv flex flex-col gap-1 py-3">
            {LINKS.concat([{ to: '/guide', label: 'AI Guide' }, { to: '/planner', label: 'Plan a trip' }]).map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-sand-100">
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Link to={dashboardLink} onClick={() => setOpen(false)} className="btn-ink flex-1">Dashboard</Link>
                  <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="btn-ghost flex-1">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ink flex-1">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

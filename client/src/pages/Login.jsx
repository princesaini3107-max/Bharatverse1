import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';
import { Button } from '../components/ui/UI.jsx';

const DEMO = [
  { role: 'Tourist', email: 'user@bharatverse.in', password: 'user123' },
  { role: 'Vendor', email: 'vendor@bharatverse.in', password: 'vendor123' },
  { role: 'Admin', email: 'admin@bharatverse.in', password: 'admin123' },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const dest = (role) => (role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor/dashboard' : '/dashboard');

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      const user = mode === 'login'
        ? await login(form.email, form.password)
        : await register(form);
      navigate(dest(user.role));
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const quick = async (d) => {
    setError(null); setBusy(true);
    try {
      const user = await login(d.email, d.password);
      navigate(dest(user.role));
    } catch (e2) { setError(e2.message); } finally { setBusy(false); }
  };

  return (
    <div className="container-bv py-14">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold">{mode === 'login' ? 'Sign in' : 'Create your account'}</h1>
          <p className="mt-1 text-sm text-ink-soft">{mode === 'login' ? 'Welcome back to BharatVerse.' : 'Join to save plans, take quizzes and list a business.'}</p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {error && <p className="rounded-lg bg-rose-heritage/10 px-3 py-2 text-sm text-rose-heritage">{error}</p>}
            {mode === 'register' && (
              <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            )}
            <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="field" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {mode === 'register' && (
              <div>
                <label className="mb-1 block text-sm font-medium">I am a…</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['user', 'Tourist / User'], ['vendor', 'Vendor / Business']].map(([v, l]) => (
                    <button type="button" key={v} onClick={() => setForm({ ...form, role: v })} className={`rounded-xl border px-3 py-2 text-sm font-medium ${form.role === v ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-sand-200'}`}>{l}</button>
                  ))}
                </div>
              </div>
            )}
            <Button variant="primary" className="w-full" type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</Button>
          </form>

          <p className="mt-4 text-sm text-ink-soft">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="font-semibold text-saffron-600">
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="card bg-ink p-8 text-white">
          <h2 className="font-display text-xl font-bold">Try demo accounts</h2>
          <p className="mt-1 text-sm text-white/70">One-click sign in to explore each role (prototype auth — not production security).</p>
          <div className="mt-5 space-y-3">
            {DEMO.map((d) => (
              <div key={d.email} className="flex items-center justify-between rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <div>
                  <div className="font-semibold">{d.role}</div>
                  <div className="text-xs text-white/60">{d.email} · {d.password}</div>
                </div>
                <button onClick={() => quick(d)} disabled={busy} className="btn-primary btn-sm px-4 py-1.5 text-xs">Use</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

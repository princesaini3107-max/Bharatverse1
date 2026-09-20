import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../lib/auth.jsx';
import { SectionHeading, Button } from '../components/ui/UI.jsx';

export default function VendorRegister() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cats = useFetch('/vendor-categories', []);
  const [form, setForm] = useState({ business_name: '', category_id: '', city: '', state: '', description: '', phone: '', email: '', services: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <div className="container-bv py-16 text-center">
        <SectionHeading title="List your business" />
        <p className="text-ink-soft">Please <Link to="/login" className="link-underline">sign in as a vendor</Link> to register a listing.</p>
        <p className="mt-2 text-sm text-ink-soft">Demo vendor: vendor@bharatverse.in / vendor123</p>
      </div>
    );
  }
  if (user.role !== 'vendor' && user.role !== 'admin') {
    return (
      <div className="container-bv py-16 text-center">
        <SectionHeading title="Vendor account required" />
        <p className="text-ink-soft">Your account is a tourist account. Create a vendor account to list a business.</p>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await api.post('/vendors', {
        ...form,
        category_id: Number(form.category_id),
        services: form.services.split(',').map((s) => s.trim()).filter(Boolean),
      });
      navigate('/vendor/dashboard');
    } catch (e2) {
      setError(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="For businesses" title="List your business" subtitle="Submit your details. Listings are reviewed by an admin before appearing publicly." />
      <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-4 p-6">
        {error && <p className="rounded-lg bg-rose-heritage/10 px-3 py-2 text-sm text-rose-heritage">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Business name *</label>
            <input className="field" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Category *</label>
            <select className="field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Select…</option>
              {(cats.data || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input className="field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Contact email</label>
            <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Services (comma-separated)</label>
            <input className="field" placeholder="e.g. Heritage rooms, Airport pickup, Guided tours" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
          </div>
        </div>
        <Button variant="primary" className="w-full" type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit for approval'}</Button>
        <p className="text-center text-xs text-ink-soft">Your listing starts as “pending” until an admin approves it.</p>
      </form>
    </div>
  );
}

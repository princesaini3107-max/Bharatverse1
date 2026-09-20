import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../lib/useFetch.js';
import { api } from '../lib/api.js';
import { Loader, ErrorState, Badge, Button, Modal } from '../components/ui/UI.jsx';
import { SmartImage } from '../lib/img.jsx';
import LeafletMap from '../components/map/LeafletMap.jsx';

export default function VendorDetail() {
  const { id } = useParams();
  const { data: v, loading, error, reload } = useFetch(`/vendors/${id}`, [id]);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    const form = e.target;
    try {
      await api.post(`/vendors/${id}/enquiry`, {
        user_name: form.name.value,
        contact: form.contact.value,
        message: form.message.value,
      });
      setSent(true);
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div className="container-bv py-10">
      <Link to="/marketplace" className="text-sm text-ink-soft hover:text-ink">← Marketplace</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-56 w-full overflow-hidden rounded-xl2"><SmartImage src={(v.images && v.images[0]) || ''} alt={v.business_name} seed={`v${v.id}`} label={v.business_name} className="h-full w-full object-cover" /></div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="peacock">{v.category}</Badge>
            {v.is_sponsored && <Badge tone="ink">Sponsored</Badge>}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold">{v.business_name}</h1>
          <p className="text-sm text-ink-soft">📍 {[v.city, v.state].filter(Boolean).join(', ')}</p>
          <p className="mt-4 text-ink-soft">{v.description}</p>
          {v.services?.length > 0 && (
            <section className="mt-6">
              <h3 className="font-display text-lg font-semibold">Services</h3>
              <div className="mt-2 flex flex-wrap gap-2">{v.services.map((s) => <Badge key={s} tone="saffron">{s}</Badge>)}</div>
            </section>
          )}
          {v.lat && v.lng && (
            <section className="mt-6">
              <h3 className="mb-2 font-display text-lg font-semibold">Location</h3>
              <LeafletMap markers={[{ lat: v.lat, lng: v.lng, title: v.business_name, subtitle: v.category }]} height={260} zoom={13} />
            </section>
          )}
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h4 className="font-semibold">Contact</h4>
            <dl className="mt-3 space-y-2 text-sm">
              {v.phone && <div className="flex justify-between"><dt className="text-ink-soft">Phone</dt><dd className="font-medium">{v.phone}</dd></div>}
              {v.email && <div className="flex justify-between"><dt className="text-ink-soft">Email</dt><dd className="font-medium break-all">{v.email}</dd></div>}
            </dl>
            <Button variant="primary" className="mt-4 w-full" onClick={() => { setSent(false); setErr(null); setOpen(true); }}>Send enquiry</Button>
            <p className="mt-2 text-xs text-ink-soft">Contact details are demo data.</p>
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Enquire — ${v.business_name}`}>
        {sent ? (
          <div className="text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-2 text-ink-soft">Enquiry sent to the vendor (demo).</p>
            <Button variant="ghost" className="mt-3" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {err && <p className="rounded-lg bg-rose-heritage/10 px-3 py-2 text-sm text-rose-heritage">{err}</p>}
            <input name="name" className="field" placeholder="Your name" required />
            <input name="contact" className="field" placeholder="Email or phone" />
            <textarea name="message" className="field" rows={3} placeholder="Your message" required defaultValue={`Hi, I'm interested in ${v.business_name}.`} />
            <Button variant="primary" className="w-full" type="submit">Send enquiry</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useFetch } from '../lib/useFetch.js';
import { Loader, ErrorState, Badge, Button, Modal } from '../components/ui/UI.jsx';
import { SmartImage } from '../lib/img.jsx';

export default function ArtisanDetail() {
  const { id } = useParams();
  const { data: a, loading, error, reload } = useFetch(`/artisans/${id}`, [id]);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  return (
    <div className="container-bv py-10">
      <Link to="/artisans" className="text-sm text-ink-soft hover:text-ink">← Artisan Stories</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <SmartImage src={a.image} alt={a.name} seed={a.id} label={a.name.split(' ')[0]} className="h-20 w-20 flex-none rounded-full object-cover" />
            <div>
              <h1 className="font-display text-3xl font-bold">{a.name}</h1>
              <p className="text-saffron-700">{a.craft}</p>
              <p className="text-sm text-ink-soft">📍 {a.region} · {a.experience_years} years' experience</p>
            </div>
          </div>
          <section className="mt-6"><h2 className="font-display text-xl font-semibold">Their story</h2><p className="mt-2 text-ink-soft">{a.story}</p></section>
          <section className="mt-6">
            <h3 className="font-display text-lg font-semibold">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">{a.skills.map((s) => <Badge key={s} tone="peacock">{s}</Badge>)}</div>
          </section>
          <section className="mt-6">
            <h3 className="font-display text-lg font-semibold">Products &amp; services</h3>
            <div className="mt-2 flex flex-wrap gap-2">{a.products.map((s) => <Badge key={s} tone="saffron">{s}</Badge>)}</div>
          </section>
        </div>
        <aside>
          <div className="card p-5">
            <h4 className="font-semibold">Interested in their work?</h4>
            <p className="mt-1 text-sm text-ink-soft">Send an enquiry (demo — no message is actually delivered).</p>
            <Button variant="primary" className="mt-3 w-full" onClick={() => { setSent(false); setOpen(true); }}>Enquire</Button>
          </div>
        </aside>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Enquire — ${a.name}`}>
        {sent ? (
          <div className="text-center">
            <div className="text-4xl">✅</div>
            <p className="mt-2 text-ink-soft">Thanks! Your enquiry has been noted (demo).</p>
            <Button variant="ghost" className="mt-3" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
            <input className="field" placeholder="Your name" required />
            <input className="field" placeholder="Email or phone" />
            <textarea className="field" rows={3} placeholder="Your message" required defaultValue={`Hi ${a.name.split(' ')[0]}, I'm interested in your ${a.craft.toLowerCase()}.`} />
            <Button variant="primary" className="w-full" type="submit">Send enquiry</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

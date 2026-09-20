import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { SectionHeading, Loader, ErrorState, EmptyState, Button } from '../components/ui/UI.jsx';
import { VendorCard } from '../components/cards/Cards.jsx';

export default function Marketplace() {
  const cats = useFetch('/vendor-categories', []);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [state, setState] = useState({ loading: true, error: null, data: [] });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (q) p.set('q', q);
    api.get(`/vendors?${p.toString()}`)
      .then((d) => setState({ loading: false, error: null, data: d }))
      .catch((e) => setState({ loading: false, error: e.message, data: [] }));
  }, [cat, q]);

  return (
    <div className="container-bv py-10">
      <SectionHeading
        eyebrow="Local Vendor Marketplace"
        title="Hotels, guides, food &amp; crafts"
        subtitle="Discover local tourism businesses. Sponsored listings are clearly labelled; there are no fake reviews."
        action={<Button variant="primary" to="/vendor/register">List your business</Button>}
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button onClick={() => setCat('')} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${cat === '' ? 'bg-saffron-500 text-white' : 'border border-sand-200 bg-white text-ink-soft hover:text-ink'}`}>All</button>
        {(cats.data || []).map((c) => (
          <button key={c.id} onClick={() => setCat(String(c.id))} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${cat === String(c.id) ? 'bg-saffron-500 text-white' : 'border border-sand-200 bg-white text-ink-soft hover:text-ink'}`}>{c.name}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search businesses…" className="field ml-auto w-full max-w-xs py-1.5 text-sm" />
      </div>

      {state.loading ? <Loader /> : state.error ? <ErrorState message={state.error} /> : state.data.length === 0 ? (
        <EmptyState title="No businesses found" message="Try a different category or search." action={<Link to="/vendor/register" className="btn-primary">Be the first to list</Link>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{state.data.map((v) => <VendorCard key={v.id} vendor={v} />)}</div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useFetch } from '../lib/useFetch.js';
import { SectionHeading, Loader, ErrorState, Badge, Modal } from '../components/ui/UI.jsx';
import { SmartImage } from '../lib/img.jsx';

export default function Museum() {
  const { data, loading, error, reload } = useFetch('/museum', []);
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState(null);

  const categories = ['All', ...Array.from(new Set((data || []).map((m) => m.category)))];
  const list = (data || []).filter((m) => cat === 'All' || m.category === cat);

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Digital Museum" title="Exhibits &amp; artefacts" subtitle="Browse crafts, sculpture, folk art and historical objects from across India." />
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${cat === c ? 'bg-ink text-white' : 'border border-sand-200 bg-white text-ink-soft hover:text-ink'}`}>{c}</button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((m) => (
              <button key={m.id} onClick={() => setActive(m)} className="card group overflow-hidden text-left transition hover:shadow-lift">
                <div className="h-40 w-full overflow-hidden"><SmartImage src={m.image} alt={m.title} seed={m.id} label={m.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
                <div className="p-4">
                  <Badge tone="saffron">{m.category}</Badge>
                  <h3 className="mt-2 font-display text-base font-semibold">{m.title}</h3>
                  <p className="text-xs text-ink-soft">{m.era} · {m.origin}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div>
            <div className="mb-4 h-48 w-full overflow-hidden rounded-xl"><SmartImage src={active.image} alt={active.title} seed={active.id} label={active.title} className="h-full w-full object-cover" /></div>
            <div className="flex flex-wrap gap-2"><Badge tone="saffron">{active.category}</Badge><Badge>{active.era}</Badge><Badge tone="peacock">{active.origin}</Badge></div>
            <p className="mt-3 text-ink-soft">{active.description}</p>
            <div className="mt-3 rounded-lg bg-sand-100 p-3 text-sm"><strong>Significance:</strong> {active.significance}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { useFetch } from '../lib/useFetch.js';
import { SectionHeading, Loader, ErrorState, EmptyState } from '../components/ui/UI.jsx';
import { ArticleCard } from '../components/cards/Cards.jsx';

export default function CultureHub() {
  const { data, loading, error, reload } = useFetch('/articles', []);
  const [cat, setCat] = useState('All');

  const categories = ['All', ...Array.from(new Set((data || []).map((a) => a.category)))];
  const list = (data || []).filter((a) => cat === 'All' || a.category === cat);

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Culture &amp; Heritage" title="The Culture Hub" subtitle="Festivals, crafts, textiles, dance and rituals — the living traditions of India." />
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${cat === c ? 'bg-rose-heritage text-white' : 'border border-sand-200 bg-white text-ink-soft hover:text-ink'}`}>{c}</button>
            ))}
          </div>
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
          ) : <EmptyState title="No articles" message="Nothing in this category yet." />}
        </>
      )}
    </div>
  );
}

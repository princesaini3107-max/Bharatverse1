import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import SearchBar from '../components/ui/SearchBar.jsx';
import { SectionHeading, Loader, EmptyState, ErrorState, Badge } from '../components/ui/UI.jsx';
import { ResultCard } from '../components/cards/Cards.jsx';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'place', label: 'Places' },
  { value: 'city', label: 'Cities' },
  { value: 'state', label: 'States' },
  { value: 'food', label: 'Food' },
  { value: 'festival', label: 'Festivals' },
  { value: 'article', label: 'Culture' },
  { value: 'artisan', label: 'Artisans' },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || '';
  const stateF = params.get('state') || '';

  const states = useFetch('/states', []);
  const [result, setResult] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    setResult({ loading: true, error: null, data: null });
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (type) query.set('type', type);
    if (stateF) query.set('state', stateF);
    api
      .get(`/explore?${query.toString()}`)
      .then((d) => setResult({ loading: false, error: null, data: d }))
      .catch((e) => setResult({ loading: false, error: e.message, data: null }));
  }, [q, type, stateF]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Explore India" title={q ? `Results for “${q}”` : 'Explore India'} subtitle="Search across states, cities, places, food, festivals, culture and artisans." />

      <div className="mb-6"><SearchBar initial={q} /></div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setParam('type', t.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              type === t.value ? 'bg-saffron-500 text-white' : 'bg-white text-ink-soft hover:text-ink border border-sand-200'
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-sand-200" />
        <select value={stateF} onChange={(e) => setParam('state', e.target.value)} className="field w-auto py-1.5 text-sm">
          <option value="">All states</option>
          {(states.data || []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {result.loading ? (
        <Loader />
      ) : result.error ? (
        <ErrorState message={result.error} />
      ) : result.data.count === 0 ? (
        <EmptyState title="No matches" message="Try a different search term or clear the filters. Demo content covers Rajasthan, Punjab, Uttar Pradesh, Bihar and Delhi." />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-soft">{result.data.count} result{result.data.count !== 1 ? 's' : ''}</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.results.map((item) => <ResultCard key={`${item.type}-${item.id}`} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}

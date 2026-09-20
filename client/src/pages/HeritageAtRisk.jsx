import { useFetch } from '../lib/useFetch.js';
import { SectionHeading, Loader, ErrorState, Badge } from '../components/ui/UI.jsx';

export default function HeritageAtRisk() {
  const { data, loading, error, reload } = useFetch('/heritage-at-risk', []);
  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Heritage at Risk" title="Lesser-known &amp; endangered traditions" subtitle="Cultural practices that deserve attention and support. Presented as contextual demo content, not official endangerment listings." />
      <div className="mb-6 rounded-xl2 border border-saffron-200 bg-saffron-50 p-4 text-sm text-saffron-700">
        ⚠️ BharatVerse does not make official claims about endangerment. The notes below distinguish documented context from demo content, in line with responsible cultural representation.
      </div>
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <div className="grid gap-5 lg:grid-cols-2">
          {(data || []).map((h) => (
            <div key={h.id} className="card p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl font-semibold">{h.practice}</h3>
                <Badge tone="rose">{h.category}</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-soft">📍 {h.region}</p>
              <p className="mt-3 text-ink-soft">{h.description}</p>
              <div className="mt-3 rounded-lg bg-peacock-50 p-3 text-sm"><strong className="text-peacock-600">Why it matters:</strong> {h.why_it_matters}</div>
              <p className="mt-3 text-xs italic text-ink-soft">{h.status_note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

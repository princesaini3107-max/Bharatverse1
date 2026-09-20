import { useFetch } from '../lib/useFetch.js';
import { SectionHeading, Loader, ErrorState } from '../components/ui/UI.jsx';
import { ArtisanCard } from '../components/cards/Cards.jsx';

export default function Artisans() {
  const { data, loading, error, reload } = useFetch('/artisans', []);
  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Artisan Stories" title="The makers keeping crafts alive" subtitle="Meet artisans behind India's textiles, painting and pottery — and enquire directly." />
      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </div>
      )}
    </div>
  );
}

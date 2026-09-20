import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch.js';
import { Loader, ErrorState, Badge } from '../components/ui/UI.jsx';
import { PlaceCard } from '../components/cards/Cards.jsx';
import { SmartImage } from '../lib/img.jsx';
import LeafletMap from '../components/map/LeafletMap.jsx';

export default function PlaceDetail() {
  const { id } = useParams();
  const { data: p, loading, error, reload } = useFetch(`/places/${id}`, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden">
        <SmartImage src={p.image} alt={p.name} seed={p.id} label={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="container-bv absolute inset-x-0 bottom-0 pb-6 text-white">
          <div className="text-sm text-white/70">
            {p.state && <Link to={`/state/${p.state.id}`} className="hover:text-white">{p.state.name}</Link>}
            {p.city && <> · <Link to={`/city/${p.city.id}`} className="hover:text-white">{p.city.name}</Link></>}
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold">{p.name}</h1>
          <div className="mt-2 flex gap-2"><Badge tone="peacock">{p.category}</Badge>{p.type === 'heritage' && <Badge tone="saffron">Heritage</Badge>}</div>
        </div>
      </div>

      <div className="container-bv grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section><h2 className="font-display text-2xl font-bold">About</h2><p className="mt-2 text-ink-soft">{p.description}</p></section>
          <section><h3 className="font-display text-xl font-semibold">Cultural significance</h3><p className="mt-2 text-ink-soft">{p.significance}</p></section>
          <section><h3 className="font-display text-xl font-semibold">Historical background</h3><p className="mt-2 text-ink-soft">{p.history}</p></section>
          {p.nearby?.length > 0 && (
            <section>
              <h3 className="font-display text-xl font-semibold">Nearby attractions</h3>
              <div className="mt-3 grid gap-5 sm:grid-cols-2">{p.nearby.map((n) => <PlaceCard key={n.id} place={n} />)}</div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h4 className="font-semibold">Visiting information</h4>
            <p className="mt-2 text-sm text-ink-soft">{p.visiting_info}</p>
            <p className="mt-2 rounded-lg bg-saffron-50 px-3 py-2 text-xs text-saffron-700">ℹ️ Timings and prices are demo data — verify locally before visiting.</p>
          </div>
          {p.lat && p.lng && (
            <div>
              <h4 className="mb-2 font-semibold">Location</h4>
              <LeafletMap markers={[{ lat: p.lat, lng: p.lng, title: p.name, subtitle: p.category }]} height={260} zoom={13} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

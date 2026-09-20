import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch.js';
import { Loader, ErrorState, Badge, EmptyState } from '../components/ui/UI.jsx';
import { PlaceCard } from '../components/cards/Cards.jsx';
import LeafletMap from '../components/map/LeafletMap.jsx';

export default function CityDetail() {
  const { id } = useParams();
  const { data: c, loading, error, reload } = useFetch(`/cities/${id}`, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  const markers = c.places.filter((p) => p.lat && p.lng).map((p) => ({ lat: p.lat, lng: p.lng, title: p.name, subtitle: p.category }));

  return (
    <div className="container-bv py-10">
      <div className="mb-2 text-sm text-ink-soft">
        <Link to="/explore" className="hover:text-ink">Explore</Link>
        {c.state && <> · <Link to={`/state/${c.state.id}`} className="hover:text-ink">{c.state.name}</Link></>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-bold">{c.name}</h1>
        <Badge tone="peacock">{c.nickname}</Badge>
      </div>
      <p className="mt-2 max-w-3xl text-ink-soft">{c.overview}</p>
      {c.known_for?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">{c.known_for.map((k) => <Badge key={k}>{k}</Badge>)}</div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-2xl font-bold">Places to explore</h2>
          {c.places.length ? (
            <div className="grid gap-5 sm:grid-cols-2">{c.places.map((p) => <PlaceCard key={p.id} place={p} />)}</div>
          ) : <EmptyState title="No places yet" message={`We haven't added places for ${c.name} yet.`} />}
        </div>
        <aside>
          <h2 className="mb-4 font-display text-2xl font-bold">On the map</h2>
          {markers.length ? <LeafletMap markers={markers} height={360} zoom={12} /> : <p className="text-ink-soft">No mapped places yet.</p>}
        </aside>
      </div>
    </div>
  );
}

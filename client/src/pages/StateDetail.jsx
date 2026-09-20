import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch.js';
import { Loader, ErrorState, SectionHeading, Badge, Tabs } from '../components/ui/UI.jsx';
import { PlaceCard, ArticleCard, ArtisanCard } from '../components/cards/Cards.jsx';
import { SmartImage } from '../lib/img.jsx';
import LeafletMap from '../components/map/LeafletMap.jsx';
import { useState } from 'react';

export default function StateDetail() {
  const { id } = useParams();
  const { data: s, loading, error, reload } = useFetch(`/states/${id}`, [id]);
  const [tab, setTab] = useState('overview');

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  const markers = [
    ...s.places.map((p) => ({ lat: p.lat, lng: p.lng, title: p.name, subtitle: p.category })),
  ].filter((m) => m.lat && m.lng);

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden">
        <SmartImage src={s.image} alt={s.name} seed={s.id} label={s.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
        <div className="container-bv absolute inset-x-0 bottom-0 pb-6 text-white">
          <Link to="/explore" className="text-sm text-white/70 hover:text-white">← Explore</Link>
          <h1 className="mt-1 font-display text-4xl font-bold">{s.name}</h1>
          <p className="text-white/85">{s.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.famous_for.map((f) => <Badge key={f} tone="saffron">{f}</Badge>)}
          </div>
        </div>
      </div>

      <div className="container-bv py-8">
        <div className="mb-6"><Tabs tabs={[
          { value: 'overview', label: 'Overview' },
          { value: 'places', label: `Places (${s.places.length})` },
          { value: 'food', label: `Food (${s.food.length})` },
          { value: 'festivals', label: `Festivals (${s.festivals.length})` },
          { value: 'culture', label: 'Culture' },
          { value: 'map', label: 'Map' },
        ]} active={tab} onChange={setTab} /></div>

        {tab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div><h3 className="font-display text-xl font-semibold">About {s.name}</h3><p className="mt-2 text-ink-soft">{s.overview}</p></div>
              <div><h3 className="font-display text-xl font-semibold">Culture</h3><p className="mt-2 text-ink-soft">{s.culture}</p></div>
              <div><h3 className="font-display text-xl font-semibold">History</h3><p className="mt-2 text-ink-soft">{s.history}</p></div>
            </div>
            <aside className="space-y-4">
              <div className="card p-5">
                <h4 className="font-semibold">Quick facts</h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-soft">Capital</dt><dd className="font-medium">{s.capital}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-soft">Region</dt><dd className="font-medium">{s.region}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-soft">Best season</dt><dd className="font-medium">{s.best_season}</dd></div>
                </dl>
              </div>
              <div className="card p-5">
                <h4 className="font-semibold">Cities</h4>
                <ul className="mt-3 space-y-2">
                  {s.cities.map((c) => (
                    <li key={c.id}><Link to={`/city/${c.id}`} className="link-underline">{c.name}</Link> <span className="text-xs text-ink-soft">· {c.nickname}</span></li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        )}

        {tab === 'places' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.places.map((p) => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}

        {tab === 'food' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.food.map((f) => (
              <div key={f.id} className="card p-5">
                <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">{f.name}</h3><Badge tone={f.veg ? 'peacock' : 'rose'}>{f.veg ? 'Veg' : 'Non-veg'}</Badge></div>
                <p className="mt-1 text-sm text-ink-soft">{f.description}</p>
                <p className="mt-2 text-xs text-ink-soft/70">📍 {f.where}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'festivals' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {s.festivals.map((f) => (
              <div key={f.id} className="card p-5">
                <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold">{f.name}</h3><Badge tone="saffron">{f.season}</Badge></div>
                <p className="mt-1 text-sm text-ink-soft">{f.description}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'culture' && (
          <div className="space-y-8">
            <div>
              <SectionHeading title="Articles" />
              {s.articles.length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{s.articles.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
              ) : <p className="text-ink-soft">No articles yet for {s.name}.</p>}
            </div>
            <div>
              <SectionHeading title="Artisans" />
              {s.artisans.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{s.artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}</div>
              ) : <p className="text-ink-soft">No artisan profiles yet for {s.name}.</p>}
            </div>
          </div>
        )}

        {tab === 'map' && (
          markers.length ? <LeafletMap markers={markers} height={420} zoom={7} /> : <p className="text-ink-soft">No mapped places yet.</p>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { SmartImage } from '../../lib/img.jsx';
import { Badge } from '../ui/UI.jsx';

export function StateCard({ state }) {
  return (
    <Link to={`/state/${state.id}`} className="card group overflow-hidden transition hover:shadow-lift">
      <div className="relative h-44 w-full overflow-hidden">
        <SmartImage src={state.image} alt={state.name} seed={state.id} label={state.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="font-display text-xl font-bold drop-shadow">{state.name}</h3>
          <p className="text-sm text-white/85">{state.tagline}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 p-4">
        {(state.famous_for || []).slice(0, 3).map((f) => (
          <Badge key={f}>{f}</Badge>
        ))}
      </div>
    </Link>
  );
}

export function PlaceCard({ place }) {
  return (
    <Link to={`/place/${place.id}`} className="card group overflow-hidden transition hover:shadow-lift">
      <div className="h-40 w-full overflow-hidden">
        <SmartImage src={place.image} alt={place.name} seed={place.id} label={place.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <Badge tone="peacock">{place.category}</Badge>
          {place.type === 'heritage' && <Badge tone="saffron">Heritage</Badge>}
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">{place.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{place.short || place.description}</p>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }) {
  return (
    <Link to={`/culture/${article.id}`} className="card group overflow-hidden transition hover:shadow-lift">
      <div className="h-36 w-full overflow-hidden">
        <SmartImage src={article.image} alt={article.title} seed={article.id} label={article.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <Badge tone="rose">{article.category}</Badge>
        <h3 className="mt-2 font-display text-lg font-semibold">{article.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{article.summary}</p>
        <p className="mt-2 text-xs text-ink-soft/70">{article.read_min} min read</p>
      </div>
    </Link>
  );
}

export function ArtisanCard({ artisan }) {
  return (
    <Link to={`/artisans/${artisan.id}`} className="card group flex items-center gap-4 p-4 transition hover:shadow-lift">
      <SmartImage src={artisan.image} alt={artisan.name} seed={artisan.id} label={artisan.name.split(' ')[0]} className="h-16 w-16 flex-none rounded-full object-cover" />
      <div>
        <h3 className="font-display text-lg font-semibold">{artisan.name}</h3>
        <p className="text-sm text-saffron-700">{artisan.craft}</p>
        <p className="text-xs text-ink-soft">{artisan.region}</p>
      </div>
    </Link>
  );
}

export function VendorCard({ vendor }) {
  return (
    <Link to={`/vendor/${vendor.id}`} className="card group overflow-hidden transition hover:shadow-lift">
      <div className="relative h-36 w-full overflow-hidden">
        <SmartImage src={(vendor.images && vendor.images[0]) || ''} alt={vendor.business_name} seed={`v${vendor.id}`} label={vendor.business_name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {vendor.is_sponsored && (
          <span className="absolute right-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-semibold text-white">Sponsored</span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <Badge tone="peacock">{vendor.category}</Badge>
        </div>
        <h3 className="font-display text-lg font-semibold">{vendor.business_name}</h3>
        <p className="text-xs text-ink-soft">{[vendor.city, vendor.state].filter(Boolean).join(', ')}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{vendor.description}</p>
      </div>
    </Link>
  );
}

// Generic result card used on the Explore results grid
const TYPE_ROUTE = {
  state: (id) => `/state/${id}`,
  city: (id) => `/city/${id}`,
  place: (id) => `/place/${id}`,
  article: (id) => `/culture/${id}`,
  artisan: (id) => `/artisans/${id}`,
  food: () => `/explore?type=food`,
  festival: () => `/explore?type=festival`,
};

export function ResultCard({ item }) {
  const to = (TYPE_ROUTE[item.type] || (() => '/explore'))(item.id);
  return (
    <Link to={to} className="card group overflow-hidden transition hover:shadow-lift">
      {item.image !== undefined && (
        <div className="h-32 w-full overflow-hidden">
          <SmartImage src={item.image} alt={item.title} seed={item.id} label={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="p-4">
        <Badge tone="saffron" className="capitalize">{item.type}</Badge>
        <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{item.subtitle}</p>
      </div>
    </Link>
  );
}

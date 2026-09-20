import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch.js';
import { Loader, ErrorState, Badge } from '../components/ui/UI.jsx';
import { SmartImage } from '../lib/img.jsx';

export default function ArticleDetail() {
  const { id } = useParams();
  const { data: a, loading, error, reload } = useFetch(`/articles/${id}`, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="container-bv py-10"><ErrorState message={error} onRetry={reload} /></div>;

  return (
    <article className="pb-10">
      <div className="relative h-72 w-full overflow-hidden">
        <SmartImage src={a.image} alt={a.title} seed={a.id} label={a.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="container-bv absolute inset-x-0 bottom-0 pb-6 text-white">
          <Link to="/culture" className="text-sm text-white/70 hover:text-white">← Culture Hub</Link>
          <div className="mt-1 flex items-center gap-2"><Badge tone="rose">{a.category}</Badge><span className="text-sm text-white/70">{a.read_min} min read</span></div>
          <h1 className="mt-2 font-display text-4xl font-bold">{a.title}</h1>
        </div>
      </div>

      <div className="container-bv grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-lg font-medium text-ink">{a.summary}</p>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-soft">{a.body}</p>
          <div className="mt-6 rounded-xl2 bg-sand-100 p-5">
            <h3 className="font-semibold">Why it matters</h3>
            <p className="mt-1 text-ink-soft">{a.significance}</p>
          </div>
        </div>
        <aside className="space-y-6">
          {a.related_places?.length > 0 && (
            <div className="card p-5">
              <h4 className="font-semibold">Related places</h4>
              <ul className="mt-3 space-y-2">
                {a.related_places.map((p) => <li key={p.id}><Link to={`/place/${p.id}`} className="link-underline">{p.name}</Link></li>)}
              </ul>
            </div>
          )}
          {a.related_artisans?.length > 0 && (
            <div className="card p-5">
              <h4 className="font-semibold">Related artisans</h4>
              <ul className="mt-3 space-y-2">
                {a.related_artisans.map((p) => <li key={p.id}><Link to={`/artisans/${p.id}`} className="link-underline">{p.name}</Link> <span className="text-xs text-ink-soft">· {p.craft}</span></li>)}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

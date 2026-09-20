import { Link } from 'react-router-dom';
import { useFetch } from '../lib/useFetch.js';
import SearchBar from '../components/ui/SearchBar.jsx';
import { SectionHeading, Loader, Button } from '../components/ui/UI.jsx';
import { StateCard, PlaceCard, ArticleCard, ArtisanCard } from '../components/cards/Cards.jsx';

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(1200px 400px at 20% -10%, #E4841B, transparent), radial-gradient(900px 500px at 100% 0%, #0E9C86, transparent)' }} />
      <div className="container-bv relative py-20 lg:py-28">
        <div className="max-w-3xl">
          <span className="chip bg-white/10 text-saffron-200">🇮🇳 Discover · Learn · Interact · Preserve</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Explore • Experience • Preserve<br />India's Living Heritage
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            One platform for India's states, heritage sites, food, festivals, artisans and local businesses — with an AI cultural guide, a travel planner, a digital museum and gamified learning.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBar big />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/70">
            <span>Try:</span>
            <Link to="/explore?q=jaipur" className="chip bg-white/10 text-white hover:bg-white/20">Jaipur</Link>
            <Link to="/explore?q=bihar" className="chip bg-white/10 text-white hover:bg-white/20">Bihar heritage</Link>
            <Link to="/explore?type=food" className="chip bg-white/10 text-white hover:bg-white/20">Local food</Link>
            <Link to="/explore?type=festival" className="chip bg-white/10 text-white hover:bg-white/20">Festivals</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  const items = [
    { icon: '🧭', title: 'AI Cultural Guide', desc: 'Ask anything about Indian culture, food and heritage.', to: '/guide' },
    { icon: '🗺️', title: 'AI Travel Planner', desc: 'Get a day-wise cultural itinerary in seconds.', to: '/planner' },
    { icon: '🏛️', title: 'Digital Museum', desc: 'Browse exhibits, crafts and historical objects.', to: '/museum' },
    { icon: '🎯', title: 'Gamified Learning', desc: 'Test your knowledge with cultural quizzes.', to: '/learn' },
  ];
  return (
    <section className="container-bv -mt-10 relative z-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link key={it.title} to={it.to} className="card p-5 transition hover:shadow-lift">
            <div className="text-3xl">{it.icon}</div>
            <h3 className="mt-2 font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{it.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const states = useFetch('/states', []);
  const places = useFetch('/explore?type=place', []);
  const articles = useFetch('/articles', []);
  const artisans = useFetch('/artisans', []);

  const featuredPlaces = (places.data?.results || []).slice(0, 6);

  return (
    <div>
      <Hero />
      <FeatureStrip />

      <section className="container-bv py-16">
        <SectionHeading
          eyebrow="Explore India"
          title="Begin with a state"
          subtitle="Detailed demo content covers Rajasthan, Punjab, Uttar Pradesh, Bihar and Delhi. The platform is built to add more."
          action={<Button variant="ghost" to="/explore">Browse all →</Button>}
        />
        {states.loading ? <Loader /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(states.data || []).map((s) => <StateCard key={s.id} state={s} />)}
          </div>
        )}
      </section>

      <section className="bg-white py-16">
        <div className="container-bv">
          <SectionHeading eyebrow="Popular destinations" title="Iconic places to explore" action={<Button variant="ghost" to="/explore?type=place">See all places →</Button>} />
          {places.loading ? <Loader /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPlaces.map((p) => (
                <PlaceCard key={p.id} place={{ id: p.id, name: p.title, short: p.subtitle.split(' · ').slice(1).join(' · '), category: p.subtitle.split(' · ')[0], image: p.image, type: 'heritage' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI banner */}
      <section className="container-bv py-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-xl2 bg-ink p-8 text-white lg:grid-cols-2 lg:p-12">
          <div>
            <span className="chip bg-white/10 text-peacock-200">BharatVerse AI</span>
            <h2 className="mt-3 font-display text-3xl font-bold">Your personal cultural guide</h2>
            <p className="mt-3 text-white/80">
              Ask “Tell me about heritage places in Bihar” or “What food should I try in Punjab?”. Answers are grounded in our knowledge base — with an honest demo mode when no local AI model is connected.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/guide" className="btn-primary">Chat with the guide</Link>
              <Link to="/planner" className="btn-ghost bg-white/10 text-white hover:bg-white/20 hover:text-white">Plan a trip</Link>
            </div>
          </div>
          <div className="rounded-xl2 bg-white/5 p-5 ring-1 ring-white/10">
            <div className="space-y-3 text-sm">
              <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-saffron-500 px-4 py-2">What can I explore near Chandigarh?</div>
              <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2">Near Chandigarh you can visit Nek Chand's Rock Garden, Sukhna Lake and the Le Corbusier Capitol Complex… <span className="text-white/50">[1]</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-bv">
          <SectionHeading eyebrow="Culture Hub" title="Traditions, crafts &amp; stories" action={<Button variant="ghost" to="/culture">All articles →</Button>} />
          {articles.loading ? <Loader /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(articles.data || []).slice(0, 3).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </div>
      </section>

      <section className="container-bv py-16">
        <SectionHeading eyebrow="Artisan Stories" title="Meet the makers" subtitle="Support the people keeping India's crafts alive." action={<Button variant="ghost" to="/artisans">All artisans →</Button>} />
        {artisans.loading ? <Loader /> : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(artisans.data || []).slice(0, 3).map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
        )}
      </section>

      {/* Vendor CTA */}
      <section className="container-bv pb-20">
        <div className="grid items-center gap-6 rounded-xl2 border border-sand-200 bg-gradient-to-br from-saffron-50 to-peacock-50 p-8 sm:grid-cols-2 lg:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Run a hotel, homestay or craft business?</h2>
            <p className="mt-2 text-ink-soft">List your business on BharatVerse and reach travellers discovering your region. Free to join in the prototype.</p>
          </div>
          <div className="flex gap-3 sm:justify-end">
            <Link to="/vendor/register" className="btn-primary">List your business</Link>
            <Link to="/marketplace" className="btn-ghost">Browse marketplace</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

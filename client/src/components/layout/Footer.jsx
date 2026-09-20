import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-sand-200 bg-ink text-white">
      <div className="container-bv grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold">BharatVerse</div>
          <p className="mt-2 max-w-xs text-sm text-white/70">
            Explore • Experience • Preserve India's living heritage. An AI-powered cultural tourism and local business discovery platform.
          </p>
          <p className="mt-3 text-xs text-white/50">Smart India Hackathon 2026 · SIH26197 · Heritage &amp; Culture</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-saffron-300">Discover</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/explore" className="hover:text-white">Explore India</Link></li>
            <li><Link to="/culture" className="hover:text-white">Culture Hub</Link></li>
            <li><Link to="/museum" className="hover:text-white">Digital Museum</Link></li>
            <li><Link to="/artisans" className="hover:text-white">Artisan Stories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-saffron-300">Experience</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/guide" className="hover:text-white">AI Cultural Guide</Link></li>
            <li><Link to="/planner" className="hover:text-white">AI Travel Planner</Link></li>
            <li><Link to="/learn" className="hover:text-white">Gamified Learning</Link></li>
            <li><Link to="/heritage-at-risk" className="hover:text-white">Heritage at Risk</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-saffron-300">For Businesses</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/marketplace" className="hover:text-white">Marketplace</Link></li>
            <li><Link to="/vendor/register" className="hover:text-white">List your business</Link></li>
            <li><Link to="/login" className="hover:text-white">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-bv flex flex-col items-center justify-between gap-2 py-4 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} BharatVerse — prototype for demonstration. Content is demo data; verify details locally.</p>
          <p>Maps © OpenStreetMap contributors</p>
        </div>
      </div>
    </footer>
  );
}

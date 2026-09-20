import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-bv flex flex-col items-center justify-center py-24 text-center">
      <div className="font-display text-6xl font-bold text-saffron-500">404</div>
      <h1 className="mt-2 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-ink-soft">This path doesn't exist in BharatVerse.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}

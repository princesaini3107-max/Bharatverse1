import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ big = false, initial = '', placeholder = 'Search places, food, festivals, crafts…' }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={submit} className={`flex items-center gap-2 ${big ? 'rounded-full bg-white p-2 shadow-lift' : ''}`}>
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className={`field pl-11 ${big ? 'border-transparent py-3 text-base focus:ring-0' : ''}`}
        />
      </div>
      <button type="submit" className={big ? 'btn-primary px-6 py-3' : 'btn-primary'}>
        Search
      </button>
    </form>
  );
}

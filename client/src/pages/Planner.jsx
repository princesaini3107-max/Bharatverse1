import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { SectionHeading, Button, Badge, ErrorState } from '../components/ui/UI.jsx';

const INTERESTS = ['Heritage', 'Food', 'Spirituality', 'Art & Crafts', 'Nature', 'Shopping', 'Photography'];
const DESTS = ['Rajasthan', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Jaipur', 'Amritsar', 'Agra', 'Varanasi', 'Bodh Gaya'];

export default function Planner() {
  const [form, setForm] = useState({ destination: 'Rajasthan', days: 3, budget: 'mid', interests: [] });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggle = (i) => setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setPlan(null);
    try {
      const res = await api.post('/planner', form);
      setPlan(res);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="AI Travel Planner" title="Plan a cultural trip" subtitle="Get a day-wise itinerary from our content. Budgets are rough estimates, clearly labelled — not live quotes." />

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={submit} className="card h-fit space-y-4 p-6 lg:col-span-1">
          <div>
            <label className="mb-1 block text-sm font-medium">Destination</label>
            <input list="dests" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="field" required />
            <datalist id="dests">{DESTS.map((d) => <option key={d} value={d} />)}</datalist>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Days: {form.days}</label>
            <input type="range" min="1" max="7" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="w-full accent-saffron-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Budget</label>
            <div className="grid grid-cols-3 gap-2">
              {[['budget', 'Budget'], ['mid', 'Mid'], ['luxury', 'Luxury']].map(([v, l]) => (
                <button type="button" key={v} onClick={() => setForm({ ...form, budget: v })} className={`rounded-xl border px-2 py-2 text-sm font-medium ${form.budget === v ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-sand-200'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Interests</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button type="button" key={i} onClick={() => toggle(i)} className={`rounded-full px-3 py-1 text-xs font-medium ${form.interests.includes(i) ? 'bg-peacock-500 text-white' : 'border border-sand-200 text-ink-soft'}`}>{i}</button>
              ))}
            </div>
          </div>
          <Button variant="primary" className="w-full" type="submit" disabled={loading}>{loading ? 'Building itinerary…' : 'Generate itinerary'}</Button>
        </form>

        <div className="lg:col-span-2">
          {error && <ErrorState message={error} />}
          {!plan && !error && (
            <div className="card flex h-full flex-col items-center justify-center p-10 text-center text-ink-soft">
              <div className="text-4xl">🗺️</div>
              <p className="mt-2">Fill the form and generate a day-wise cultural itinerary.</p>
            </div>
          )}
          {plan && (
            <div className="fade-up">
              <div className="card mb-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-bold">{plan.destination}</h2>
                    <p className="text-sm text-ink-soft">{plan.state} · {plan.days} days · {plan.budget_band}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-saffron-600">≈ ₹{plan.estimated_total_inr.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-ink-soft">estimated total</div>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-saffron-50 px-3 py-2 text-xs text-saffron-700">ℹ️ {plan.estimate_note}</p>
                {plan.interests?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{plan.interests.map((i) => <Badge key={i} tone="peacock">{i}</Badge>)}</div>}
              </div>

              <div className="space-y-4">
                {plan.itinerary.map((d) => (
                  <div key={d.day} className="card p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink font-bold text-white">{d.day}</span>
                      <h3 className="font-display text-lg font-semibold">{d.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {d.places.map((p) => (
                        <li key={p.id} className="flex items-start gap-3">
                          <Badge tone="saffron">{p.time}</Badge>
                          <div><Link to={`/place/${p.id}`} className="font-medium link-underline">{p.name}</Link><span className="text-sm text-ink-soft"> — {p.note}</span></div>
                        </li>
                      ))}
                    </ul>
                    {d.food && <p className="mt-3 text-sm text-ink-soft">🍽️ <strong>Try:</strong> {d.food.name} — {d.food.description}</p>}
                    <p className="mt-1 text-sm text-ink-soft">🌆 {d.evening}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

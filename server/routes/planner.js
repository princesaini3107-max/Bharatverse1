import { Router } from 'express';
import db from '../db/sqlite.js';
import { states, cities, places, food, festivals, byId } from '../data/index.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Rough per-day budget bands (INR) — clearly labelled estimates, not live prices.
const BUDGET_BANDS = {
  budget: { perDay: 2500, label: 'Budget' },
  mid: { perDay: 6000, label: 'Mid-range' },
  luxury: { perDay: 15000, label: 'Luxury' },
};

function resolveDestination(dest) {
  const d = String(dest || '').toLowerCase().trim();
  const state = states.find((s) => s.name.toLowerCase() === d || s.id === d);
  if (state) return { kind: 'state', state, cityList: cities.filter((c) => c.state_id === state.id) };
  const city = cities.find((c) => c.name.toLowerCase() === d || c.id === d);
  if (city) {
    const state2 = byId(states, city.state_id);
    return { kind: 'city', state: state2, city, cityList: [city] };
  }
  return null;
}

router.post('/planner', optionalAuth, (req, res) => {
  const { destination, days, budget, interests } = req.body || {};
  const nDays = Math.max(1, Math.min(7, Number(days) || 3));
  const band = BUDGET_BANDS[budget] || BUDGET_BANDS.mid;
  const resolved = resolveDestination(destination);

  if (!resolved) {
    return res.status(404).json({
      error: `We don't have demo content for "${destination}" yet. Try Rajasthan, Punjab, Uttar Pradesh, Bihar or Delhi, or a city like Jaipur, Amritsar, Agra, Varanasi, Bodh Gaya or Delhi.`,
    });
  }

  const stateId = resolved.state.id;
  const placePool = places.filter((p) =>
    resolved.kind === 'city' ? p.city_id === resolved.city.id : p.state_id === stateId
  );
  const foodPool = food.filter((f) => f.state_id === stateId);
  const festPool = festivals.filter((f) => f.state_id === stateId);

  // Spread places across days (2 per day where possible).
  const perDay = 2;
  const itinerary = [];
  let pIndex = 0;
  for (let day = 1; day <= nDays; day++) {
    const dayPlaces = [];
    for (let k = 0; k < perDay && pIndex < placePool.length; k++, pIndex++) {
      const p = placePool[pIndex];
      dayPlaces.push({
        id: p.id,
        name: p.name,
        category: p.category,
        note: p.short,
        time: k === 0 ? 'Morning' : 'Afternoon',
      });
    }
    // If we run out of unique places, cycle experiences/food instead.
    const foodPick = foodPool[(day - 1) % Math.max(1, foodPool.length)];
    itinerary.push({
      day,
      title: dayPlaces.length
        ? `Day ${day}: ${dayPlaces.map((d) => d.name).join(' & ')}`
        : `Day ${day}: Local culture & leisure`,
      places: dayPlaces,
      food: foodPick ? { name: foodPick.name, description: foodPick.description } : null,
      evening: day === nDays && festPool[0] ? `If timing aligns, experience ${festPool[0].name} (${festPool[0].season}).` : 'Explore local bazaars and cuisine in the evening.',
    });
  }

  const estBudget = band.perDay * nDays;
  const plan = {
    destination: resolved.kind === 'city' ? resolved.city.name : resolved.state.name,
    state: resolved.state.name,
    days: nDays,
    budget_band: band.label,
    estimated_total_inr: estBudget,
    estimate_note: 'Budget is a rough per-day estimate for demonstration only — it excludes flights and is not a live quote.',
    interests: Array.isArray(interests) ? interests : [],
    itinerary,
  };

  if (req.user) {
    db.prepare(
      'INSERT INTO travel_plans (user_id, destination, days, budget, interests_json, itinerary_json) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(req.user.id, plan.destination, nDays, band.label, JSON.stringify(plan.interests), JSON.stringify(plan));
  }

  res.json(plan);
});

router.get('/my/plans', optionalAuth, (req, res) => {
  if (!req.user) return res.json([]);
  const rows = db.prepare('SELECT * FROM travel_plans WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows.map((r) => ({ ...r, itinerary: JSON.parse(r.itinerary_json), interests: JSON.parse(r.interests_json || '[]') })));
});

export default router;

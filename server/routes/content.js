import { Router } from 'express';
import {
  states,
  cities,
  places,
  food,
  festivals,
  articles,
  museum,
  artisans,
  heritageAtRisk,
  byId,
} from '../data/index.js';

const router = Router();

// ---- States ----
router.get('/states', (_req, res) => {
  res.json(
    states.map((s) => ({
      id: s.id,
      name: s.name,
      capital: s.capital,
      region: s.region,
      tagline: s.tagline,
      famous_for: s.famous_for,
      accent: s.accent,
      image: s.image,
      lat: s.lat,
      lng: s.lng,
    }))
  );
});

router.get('/states/:id', (req, res) => {
  const state = byId(states, req.params.id);
  if (!state) return res.status(404).json({ error: 'State not found.' });
  res.json({
    ...state,
    cities: cities.filter((c) => c.state_id === state.id),
    places: places.filter((p) => p.state_id === state.id),
    food: food.filter((f) => f.state_id === state.id),
    festivals: festivals.filter((f) => f.state_id === state.id),
    articles: articles.filter((a) => a.state_id === state.id),
    artisans: artisans.filter((a) => a.state_id === state.id),
  });
});

// ---- Cities ----
router.get('/cities/:id', (req, res) => {
  const city = byId(cities, req.params.id);
  if (!city) return res.status(404).json({ error: 'City not found.' });
  const state = byId(states, city.state_id);
  res.json({
    ...city,
    state: state ? { id: state.id, name: state.name, accent: state.accent } : null,
    places: places.filter((p) => p.city_id === city.id),
  });
});

// ---- Places ----
router.get('/places/:id', (req, res) => {
  const place = byId(places, req.params.id);
  if (!place) return res.status(404).json({ error: 'Place not found.' });
  const city = byId(cities, place.city_id);
  const state = byId(states, place.state_id);
  const nearby = places
    .filter((p) => p.city_id === place.city_id && p.id !== place.id)
    .slice(0, 4);
  res.json({
    ...place,
    city: city ? { id: city.id, name: city.name } : null,
    state: state ? { id: state.id, name: state.name, accent: state.accent } : null,
    nearby,
  });
});

// ---- Culture hub articles ----
router.get('/articles', (req, res) => {
  const { category, state } = req.query;
  let list = articles;
  if (category) list = list.filter((a) => a.category.toLowerCase() === String(category).toLowerCase());
  if (state) list = list.filter((a) => a.state_id === state);
  res.json(
    list.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      state_id: a.state_id,
      summary: a.summary,
      read_min: a.read_min,
      image: a.image,
    }))
  );
});

router.get('/articles/:id', (req, res) => {
  const article = byId(articles, req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found.' });
  const related_places = (article.related_places || [])
    .map((pid) => byId(places, pid))
    .filter(Boolean)
    .map((p) => ({ id: p.id, name: p.name, short: p.short }));
  const related_artisans = (article.related_artisans || [])
    .map((aid) => byId(artisans, aid))
    .filter(Boolean)
    .map((a) => ({ id: a.id, name: a.name, craft: a.craft }));
  res.json({ ...article, related_places, related_artisans });
});

// ---- Digital museum ----
router.get('/museum', (req, res) => {
  const { category } = req.query;
  let list = museum;
  if (category) list = list.filter((m) => m.category.toLowerCase() === String(category).toLowerCase());
  res.json(list);
});

// ---- Artisans ----
router.get('/artisans', (_req, res) => {
  res.json(
    artisans.map((a) => ({
      id: a.id,
      name: a.name,
      craft: a.craft,
      region: a.region,
      state_id: a.state_id,
      image: a.image,
    }))
  );
});

router.get('/artisans/:id', (req, res) => {
  const artisan = byId(artisans, req.params.id);
  if (!artisan) return res.status(404).json({ error: 'Artisan not found.' });
  res.json(artisan);
});

// ---- Heritage at risk ----
router.get('/heritage-at-risk', (_req, res) => {
  res.json(heritageAtRisk);
});

// ---- Global explore / search ----
router.get('/explore', (req, res) => {
  const q = String(req.query.q || '').toLowerCase().trim();
  const stateFilter = req.query.state ? String(req.query.state) : null;
  const typeFilter = req.query.type ? String(req.query.type) : null; // place|food|festival|article|artisan|city|state

  const results = [];
  const match = (text) => !q || String(text).toLowerCase().includes(q);

  if (!typeFilter || typeFilter === 'state')
    states.forEach((s) => {
      if ((!stateFilter || s.id === stateFilter) && (match(s.name) || match(s.overview) || s.famous_for.some(match)))
        results.push({ type: 'state', id: s.id, title: s.name, subtitle: s.tagline, state_id: s.id, image: s.image });
    });

  if (!typeFilter || typeFilter === 'city')
    cities.forEach((c) => {
      if ((!stateFilter || c.state_id === stateFilter) && (match(c.name) || match(c.overview) || (c.known_for || []).some(match)))
        results.push({ type: 'city', id: c.id, title: c.name, subtitle: c.nickname, state_id: c.state_id });
    });

  if (!typeFilter || typeFilter === 'place')
    places.forEach((p) => {
      if ((!stateFilter || p.state_id === stateFilter) && (match(p.name) || match(p.short) || match(p.category)))
        results.push({ type: 'place', id: p.id, title: p.name, subtitle: `${p.category} · ${p.short}`, state_id: p.state_id, image: p.image });
    });

  if (!typeFilter || typeFilter === 'food')
    food.forEach((f) => {
      if ((!stateFilter || f.state_id === stateFilter) && (match(f.name) || match(f.description)))
        results.push({ type: 'food', id: f.id, title: f.name, subtitle: f.description, state_id: f.state_id });
    });

  if (!typeFilter || typeFilter === 'festival')
    festivals.forEach((f) => {
      if ((!stateFilter || f.state_id === stateFilter) && (match(f.name) || match(f.description)))
        results.push({ type: 'festival', id: f.id, title: f.name, subtitle: `${f.season} · ${f.description}`, state_id: f.state_id });
    });

  if (!typeFilter || typeFilter === 'article')
    articles.forEach((a) => {
      if ((!stateFilter || a.state_id === stateFilter) && (match(a.title) || match(a.summary)))
        results.push({ type: 'article', id: a.id, title: a.title, subtitle: a.summary, state_id: a.state_id, image: a.image });
    });

  if (!typeFilter || typeFilter === 'artisan')
    artisans.forEach((a) => {
      if ((!stateFilter || a.state_id === stateFilter) && (match(a.name) || match(a.craft) || match(a.story)))
        results.push({ type: 'artisan', id: a.id, title: a.name, subtitle: `${a.craft} · ${a.region}`, state_id: a.state_id, image: a.image });
    });

  res.json({ query: q, count: results.length, results });
});

export default router;

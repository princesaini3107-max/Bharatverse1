import { states, cities, places, food, festivals, articles, kb } from '../data/index.js';

// Build a flat set of retrievable documents from all cultural content plus the
// curated kb.json. Each document carries text + tags so the retriever can rank
// them and the chatbot can cite a source. This is the "RAG-ready" corpus; swap
// the keyword retriever for a vector store later without changing this shape.

function stateName(id) {
  const s = states.find((x) => x.id === id);
  return s ? s.name : '';
}

let DOCS = null;

export function getDocuments() {
  if (DOCS) return DOCS;
  const docs = [];

  states.forEach((s) => {
    docs.push({
      id: `state-${s.id}`,
      source: `State: ${s.name}`,
      title: s.name,
      tags: [s.id, 'state', 'overview', ...s.famous_for.map((f) => f.toLowerCase())],
      text: `${s.name} (capital ${s.capital}). ${s.overview} Culture: ${s.culture} History: ${s.history} Famous for: ${s.famous_for.join(', ')}. Best season to visit: ${s.best_season}.`,
    });
  });

  cities.forEach((c) => {
    docs.push({
      id: `city-${c.id}`,
      source: `City: ${c.name}, ${stateName(c.state_id)}`,
      title: c.name,
      tags: [c.state_id, c.id, 'city', ...(c.known_for || []).map((k) => k.toLowerCase())],
      text: `${c.name} (${c.nickname}) in ${stateName(c.state_id)}. ${c.overview} Known for: ${(c.known_for || []).join(', ')}.`,
    });
  });

  places.forEach((p) => {
    docs.push({
      id: `place-${p.id}`,
      source: `Place: ${p.name}`,
      title: p.name,
      tags: [p.state_id, p.city_id, 'place', p.category.toLowerCase(), p.type],
      text: `${p.name} (${p.category}) in ${stateName(p.state_id)}. ${p.description} Significance: ${p.significance} History: ${p.history}`,
    });
  });

  food.forEach((f) => {
    docs.push({
      id: `food-${f.id}`,
      source: `Food: ${f.name}`,
      title: f.name,
      tags: [f.state_id, 'food', f.type.toLowerCase(), f.veg ? 'vegetarian' : 'non-vegetarian'],
      text: `${f.name} is a ${f.veg ? 'vegetarian' : 'non-vegetarian'} ${f.type.toLowerCase()} from ${stateName(f.state_id)} (${f.where}). ${f.description}`,
    });
  });

  festivals.forEach((f) => {
    docs.push({
      id: `festival-${f.id}`,
      source: `Festival: ${f.name}`,
      title: f.name,
      tags: [f.state_id, 'festival'],
      text: `${f.name} is celebrated in ${stateName(f.state_id)} (${f.season}). ${f.description}`,
    });
  });

  articles.forEach((a) => {
    docs.push({
      id: `article-${a.id}`,
      source: `Article: ${a.title}`,
      title: a.title,
      tags: [a.state_id, 'article', a.category.toLowerCase()],
      text: `${a.title}. ${a.summary} ${a.body} Significance: ${a.significance}`,
    });
  });

  kb.forEach((k) => {
    docs.push({ id: k.id, source: k.title, title: k.title, tags: k.tags, text: k.text });
  });

  DOCS = docs;
  return DOCS;
}

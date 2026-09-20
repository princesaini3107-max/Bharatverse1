import { getDocuments } from './knowledgeBase.js';

// Lightweight TF-IDF-ish keyword retriever. No external deps, no vectors —
// but the interface (retrieve -> ranked docs) is drop-in replaceable with a
// vector store later. Good enough to ground the chatbot in real content.

const STOP = new Set(
  'a an the is are was were be to of in on at for and or but with about from into over near me my i you your what which who whom how when where why tell show give find can could would should do does list some any it its this that these those please'.split(
    ' '
  )
);

function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && w.length > 1 && !STOP.has(w));
}

let IDF = null;
let DOC_TOKENS = null;

function ensureIndex() {
  if (IDF) return;
  const docs = getDocuments();
  DOC_TOKENS = docs.map((d) => tokenize(`${d.title} ${d.text} ${(d.tags || []).join(' ')}`));
  const df = new Map();
  DOC_TOKENS.forEach((toks) => {
    new Set(toks).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });
  const N = docs.length;
  IDF = new Map();
  df.forEach((count, term) => IDF.set(term, Math.log(1 + N / count)));
}

/**
 * Retrieve the top-k most relevant documents for a query.
 * @returns {Array<{doc, score}>}
 */
export function retrieve(query, k = 4) {
  ensureIndex();
  const docs = getDocuments();
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const qSet = new Set(qTokens);

  const scored = docs.map((doc, i) => {
    const toks = DOC_TOKENS[i];
    const tf = new Map();
    toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    let score = 0;
    qSet.forEach((qt) => {
      if (tf.has(qt)) score += (tf.get(qt) / toks.length) * (IDF.get(qt) || 0);
      // tag / exact-title boosts
      if ((doc.tags || []).includes(qt)) score += 0.15;
    });
    if (doc.title && query.toLowerCase().includes(doc.title.toLowerCase())) score += 0.4;
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

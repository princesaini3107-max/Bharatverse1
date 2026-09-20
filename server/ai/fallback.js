// Deterministic "demo mode" answer composer. When no local LLM is available,
// we still give a genuinely useful, grounded answer by stitching together the
// retrieved knowledge-base chunks. This is clearly labelled as demo mode in the
// API response so we never pretend a real model produced it.

export function composeFallback(question, chunks) {
  if (!chunks || chunks.length === 0) {
    return {
      answer:
        "I don't have information on that in my current knowledge base. Right now I cover Rajasthan, Punjab, Uttar Pradesh, Bihar and Delhi — their heritage sites, food, festivals and crafts. Try asking, for example, \u201CHeritage places in Bihar\u201D or \u201CWhat food should I try in Punjab?\u201D",
      sources: [],
    };
  }

  const top = chunks[0].doc;
  const q = question.toLowerCase();

  // Light intent shaping for nicer phrasing.
  let intro = 'Here\u2019s what I found';
  if (/food|eat|dish|cuisine/.test(q)) intro = 'Here are some dishes and food notes';
  else if (/festival|celebrat/.test(q)) intro = 'Here are the festivals I know about';
  else if (/place|visit|see|heritage|monument|fort|temple/.test(q)) intro = 'Here are places you can explore';
  else if (/plan|itinerary|days|trip/.test(q)) intro = 'Here are some ideas to build on';

  const body = chunks
    .map((c, i) => `\u2022 ${trim(c.doc.text, 320)} [${i + 1}]`)
    .join('\n');

  const sources = chunks.map((c, i) => ({ n: i + 1, source: c.doc.source, id: c.doc.id }));

  const answer = `${intro} on \u201C${question.trim()}\u201D:\n\n${body}\n\nNote: prices, timings and availability aren\u2019t provided \u2014 please verify locally before you travel.`;
  return { answer, sources, lead: top.title };
}

function trim(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '\u2026';
}

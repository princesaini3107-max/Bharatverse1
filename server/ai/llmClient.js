// Optional local-LLM integration via Ollama. Entirely free and local.
// If OLLAMA_URL is not set or the server is unreachable, callers fall back to
// the deterministic grounded answer in fallback.js. We NEVER invent API keys
// or call a paid service.

const OLLAMA_URL = process.env.OLLAMA_URL || '';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export function isLLMConfigured() {
  return Boolean(OLLAMA_URL);
}

/** Quick availability probe (short timeout) so the UI can show model status. */
export async function llmAvailable() {
  if (!OLLAMA_URL) return false;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1200);
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Ask the local LLM, grounded in retrieved context chunks.
 * Returns the answer string, or null if the model is unavailable/errored
 * (so the caller can use the fallback).
 */
export async function askLLM(question, contextChunks) {
  if (!OLLAMA_URL) return null;
  const context = contextChunks.map((c, i) => `[${i + 1}] ${c.doc.source}: ${c.doc.text}`).join('\n\n');
  const system =
    'You are BharatVerse AI, a friendly guide to Indian culture, heritage, food, festivals and travel. ' +
    'Answer ONLY using the provided context. If the context does not contain the answer, say you do not have that information yet. ' +
    'Never invent live prices, opening hours, availability or directions. Keep answers concise and warm. Cite sources as [1], [2].';
  const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system,
        prompt,
        stream: false,
        options: { temperature: 0.4 },
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    return (data.response || '').trim() || null;
  } catch {
    return null;
  }
}

import { Router } from 'express';
import { retrieve } from '../ai/retriever.js';
import { askLLM, llmAvailable, isLLMConfigured } from '../ai/llmClient.js';
import { composeFallback } from '../ai/fallback.js';

const router = Router();

// Report AI status so the UI can show "Local LLM connected" vs "Demo mode".
router.get('/ai/status', async (_req, res) => {
  const configured = isLLMConfigured();
  const available = configured ? await llmAvailable() : false;
  res.json({
    configured,
    available,
    mode: available ? 'llm' : 'demo',
    note: available
      ? 'Connected to a local LLM (Ollama). Answers are generated and grounded in the knowledge base.'
      : 'Running in demo mode: answers are composed directly from retrieved knowledge-base content (no external AI service, no API keys).',
  });
});

// Chat endpoint: retrieve -> (LLM if available) -> else grounded fallback.
router.post('/ai/chat', async (req, res) => {
  const message = String((req.body && req.body.message) || '').trim();
  if (!message) return res.status(400).json({ error: 'Please enter a question.' });

  const chunks = retrieve(message, 4);

  // Try local LLM first (only if configured + reachable).
  let mode = 'demo';
  let answer = null;
  if (isLLMConfigured()) {
    answer = await askLLM(message, chunks);
    if (answer) mode = 'llm';
  }

  let sources = chunks.map((c, i) => ({ n: i + 1, source: c.doc.source, id: c.doc.id }));

  if (!answer) {
    const fb = composeFallback(message, chunks);
    answer = fb.answer;
    sources = fb.sources;
  }

  res.json({ mode, answer, sources });
});

export default router;

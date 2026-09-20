import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useFetch } from '../lib/useFetch.js';
import { Badge } from '../components/ui/UI.jsx';

const SUGGESTIONS = [
  'Tell me about heritage places in Bihar',
  'What traditional food should I try in Punjab?',
  'Which cultural places can I explore near Chandigarh?',
  'Tell me about Madhubani painting',
  'Best time to visit Rajasthan',
];

export default function Guide() {
  const status = useFetch('/ai/status', []);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Namaste! I'm BharatVerse AI. Ask me about India's culture, heritage, food, festivals and travel. I answer from a curated knowledge base covering Rajasthan, Punjab, Uttar Pradesh, Bihar and Delhi." },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setBusy(true);
    try {
      const res = await api.post('/ai/chat', { message: msg });
      setMessages((m) => [...m, { role: 'ai', text: res.answer, sources: res.sources, mode: res.mode }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'ai', text: `Sorry — ${e.message}`, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  const mode = status.data?.mode;

  return (
    <div className="container-bv py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">BharatVerse AI</h1>
            <p className="text-ink-soft">Your cultural &amp; travel guide</p>
          </div>
          {status.data && (
            <Badge tone={mode === 'llm' ? 'peacock' : 'saffron'}>
              {mode === 'llm' ? '● Local LLM connected' : '● Demo mode (grounded)'}
            </Badge>
          )}
        </div>

        {mode === 'demo' && (
          <p className="mb-4 rounded-xl2 border border-saffron-200 bg-saffron-50 p-3 text-sm text-saffron-700">
            No local AI model is connected, so answers are composed directly from the knowledge base (no API keys, no paid service). Connect Ollama to enable full LLM generation — see the README.
          </p>
        )}

        <div className="card flex h-[60vh] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user' ? 'rounded-br-sm bg-saffron-500 text-white' : m.error ? 'bg-rose-heritage/10 text-rose-heritage' : 'rounded-bl-sm bg-sand-100 text-ink'
                }`}>
                  {m.text}
                  {m.sources?.length > 0 && (
                    <div className="mt-2 border-t border-ink/10 pt-2 text-xs text-ink-soft">
                      <span className="font-semibold">Sources: </span>
                      {m.sources.map((s) => `[${s.n}] ${s.source}`).join('  ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-sm bg-sand-100 px-4 py-2.5 text-sm text-ink-soft">Thinking…</div></div>}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-sand-200 p-3">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="chip hover:bg-sand-200">{s}</button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 border-t border-sand-200 p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about culture, food, places…" className="field" aria-label="Message" />
            <button type="submit" className="btn-primary" disabled={busy || !input.trim()}>Send</button>
          </form>
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">BharatVerse AI does not provide live prices, timings or availability. Verify details before you travel.</p>
      </div>
    </div>
  );
}

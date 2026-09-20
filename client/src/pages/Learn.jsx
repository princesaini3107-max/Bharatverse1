import { useState } from 'react';
import { useFetch } from '../lib/useFetch.js';
import { api } from '../lib/api.js';
import { SectionHeading, Loader, ErrorState, Badge, Button } from '../components/ui/UI.jsx';

function QuizPlayer({ quizId, onExit }) {
  const { data: quiz, loading, error, reload } = useFetch(`/quizzes/${quizId}`, [quizId]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [picked, setPicked] = useState(null); // current selection (locked after choosing)
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const isLast = idx === total - 1;

  const choose = (i) => {
    if (picked !== null) return; // lock
    setPicked(i);
    setAnswers((a) => ({ ...a, [idx]: i }));
  };

  const next = async () => {
    if (isLast) {
      setSubmitting(true);
      try {
        const arr = quiz.questions.map((_, i) => answers[i] ?? -1);
        const res = await api.post(`/quizzes/${quizId}/submit`, { answers: arr });
        setResult(res);
      } catch (e) {
        setResult({ error: e.message });
      } finally {
        setSubmitting(false);
      }
    } else {
      setIdx((v) => v + 1);
      setPicked(answers[idx + 1] ?? null);
    }
  };

  if (result) {
    if (result.error) return <ErrorState message={result.error} />;
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="card p-8 text-center fade-up">
        <div className="text-5xl">{pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '📚'}</div>
        <h2 className="mt-3 font-display text-3xl font-bold">{result.score} / {result.total}</h2>
        <p className="text-ink-soft">You scored {pct}%</p>
        <div className="mx-auto mt-6 max-w-xl space-y-3 text-left">
          {result.review.map((r, i) => (
            <div key={i} className={`rounded-xl border p-3 ${r.correct ? 'border-peacock-200 bg-peacock-50' : 'border-rose-heritage/30 bg-rose-heritage/5'}`}>
              <div className="flex items-start gap-2">
                <span>{r.correct ? '✅' : '❌'}</span>
                <div>
                  <p className="text-sm font-medium">{quiz.questions[i].q}</p>
                  <p className="mt-1 text-sm text-ink-soft"><strong>Answer:</strong> {quiz.questions[i].options[r.correct_option]}</p>
                  <p className="mt-1 text-xs text-ink-soft">💡 {r.fact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="ghost" onClick={onExit}>Back to quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <Badge tone="saffron">{quiz.title}</Badge>
        <span className="text-sm text-ink-soft">Question {idx + 1} / {total}</span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-sand-100">
        <div className="h-full rounded-full bg-saffron-500 transition-all" style={{ width: `${((idx + (picked !== null ? 1 : 0)) / total) * 100}%` }} />
      </div>
      <h2 className="font-display text-xl font-semibold">{q.q}</h2>
      <div className="mt-4 grid gap-3">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          let cls = 'border-sand-200 bg-white hover:border-saffron-400';
          if (picked !== null) {
            if (i === picked) cls = 'border-saffron-500 bg-saffron-50';
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${cls}`}>
              <span className="mr-2 font-bold text-saffron-600">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={next} disabled={picked === null || submitting}>
          {submitting ? 'Scoring…' : isLast ? 'Finish quiz' : 'Next question'}
        </Button>
      </div>
    </div>
  );
}

export default function Learn() {
  const { data, loading, error, reload } = useFetch('/quizzes', []);
  const [active, setActive] = useState(null);

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow="Gamified Learning" title="Test your cultural knowledge" subtitle="Short quizzes on monuments, festivals and crafts — with a fact after every question." />
      {active ? (
        <div className="mx-auto max-w-2xl">
          <button onClick={() => setActive(null)} className="mb-4 text-sm text-ink-soft hover:text-ink">← All quizzes</button>
          <QuizPlayer quizId={active} onExit={() => setActive(null)} />
        </div>
      ) : loading ? <Loader /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data || []).map((quiz) => (
            <button key={quiz.id} onClick={() => setActive(quiz.id)} className="card p-6 text-left transition hover:shadow-lift">
              <div className="flex items-center justify-between"><Badge tone="peacock">{quiz.category}</Badge><Badge>{quiz.difficulty}</Badge></div>
              <h3 className="mt-3 font-display text-xl font-semibold">{quiz.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{quiz.description}</p>
              <p className="mt-3 text-xs text-ink-soft/70">{quiz.question_count} questions</p>
              <span className="mt-4 inline-block text-sm font-semibold text-saffron-600">Start quiz →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

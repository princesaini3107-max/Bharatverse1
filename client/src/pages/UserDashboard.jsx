import { useFetch } from '../lib/useFetch.js';
import { useAuth } from '../lib/auth.jsx';
import { SectionHeading, Loader, Badge, Button } from '../components/ui/UI.jsx';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const plans = useFetch('/my/plans', []);
  const quizzes = useFetch('/my/quiz-results', []);

  return (
    <div className="container-bv py-10">
      <SectionHeading eyebrow={`Welcome, ${user?.name?.split(' ')[0]}`} title="Your dashboard" subtitle="Your saved travel plans and quiz history." />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Saved travel plans</h3>
            <Button variant="ghost" to="/planner">New plan</Button>
          </div>
          {plans.loading ? <Loader /> : (plans.data || []).length === 0 ? (
            <div className="card p-6 text-ink-soft">No saved plans yet. <Link to="/planner" className="link-underline">Create one →</Link></div>
          ) : (
            <div className="space-y-3">
              {plans.data.map((p) => (
                <div key={p.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{p.destination}</h4>
                    <Badge tone="saffron">{p.days} days</Badge>
                  </div>
                  <p className="text-sm text-ink-soft">{p.budget} · {p.itinerary?.itinerary?.length || p.days} day plan</p>
                  <p className="text-xs text-ink-soft/60">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Quiz history</h3>
            <Button variant="ghost" to="/learn">Take a quiz</Button>
          </div>
          {quizzes.loading ? <Loader /> : (quizzes.data || []).length === 0 ? (
            <div className="card p-6 text-ink-soft">No quiz attempts yet. <Link to="/learn" className="link-underline">Start learning →</Link></div>
          ) : (
            <div className="space-y-3">
              {quizzes.data.map((q) => (
                <div key={q.id} className="card flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-semibold">{q.quiz_id}</h4>
                    <p className="text-xs text-ink-soft/60">{new Date(q.taken_at).toLocaleDateString()}</p>
                  </div>
                  <Badge tone={q.score / q.total >= 0.5 ? 'peacock' : 'rose'}>{q.score} / {q.total}</Badge>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import { Router } from 'express';
import db from '../db/sqlite.js';
import { quizzes, byId } from '../data/index.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// List quizzes (without answers)
router.get('/quizzes', (_req, res) => {
  res.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      description: q.description,
      question_count: q.questions.length,
    }))
  );
});

// Get one quiz WITH questions but WITHOUT the answer index (so the client
// can't trivially read the key). Answers are checked on submit.
router.get('/quizzes/:id', (req, res) => {
  const quiz = byId(quizzes, req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  res.json({
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    difficulty: quiz.difficulty,
    description: quiz.description,
    questions: quiz.questions.map((q, i) => ({ i, q: q.q, options: q.options })),
  });
});

// Submit answers -> returns score + per-question correctness + facts
router.post('/quizzes/:id/submit', optionalAuth, (req, res) => {
  const quiz = byId(quizzes, req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });
  const answers = (req.body && req.body.answers) || [];
  let score = 0;
  const review = quiz.questions.map((q, i) => {
    const given = answers[i];
    const correct = given === q.answer;
    if (correct) score += 1;
    return { i, correct, correct_option: q.answer, given: given ?? null, fact: q.fact };
  });
  if (req.user) {
    db.prepare('INSERT INTO quiz_results (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      quiz.id,
      score,
      quiz.questions.length
    );
  }
  res.json({ score, total: quiz.questions.length, review });
});

// A signed-in user's own quiz history
router.get('/my/quiz-results', optionalAuth, (req, res) => {
  if (!req.user) return res.json([]);
  res.json(db.prepare('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY taken_at DESC').all(req.user.id));
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/sqlite.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required.' });
  const safeRole = ['user', 'vendor'].includes(role) ? role : 'user'; // admin can't self-register
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, safeRole);
  const user = { id: info.lastInsertRowid, name, email, role: safeRole };
  res.status(201).json({ token: signToken(user), user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash))
    return res.status(401).json({ error: 'Invalid email or password.' });
  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  res.json({ token: signToken(user), user });
});

router.get('/me', requireAuth, (req, res) => {
  const row = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!row) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: row });
});

export default router;

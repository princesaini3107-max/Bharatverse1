import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initSchema } from './db/sqlite.js';
import { optionalAuth } from './middleware/auth.js';

import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import adminRoutes from './routes/admin.js';
import quizRoutes from './routes/quiz.js';
import plannerRoutes from './routes/planner.js';
import aiRoutes from './routes/ai.js';

initSchema();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(optionalAuth); // attaches req.user when a token is present

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'BharatVerse API' }));

// Feature routes (all under /api)
app.use('/api', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', quizRoutes);
app.use('/api', plannerRoutes);
app.use('/api', aiRoutes);

// 404 for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));

// Central error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[BharatVerse] API listening on http://localhost:${PORT}`);
});

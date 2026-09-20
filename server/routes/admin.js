import { Router } from 'express';
import db from '../db/sqlite.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// All admin routes require an admin account.
router.use(requireRole('admin'));

function shape(v) {
  const c = db.prepare('SELECT name FROM vendor_categories WHERE id = ?').get(v.category_id);
  return {
    ...v,
    category: c ? c.name : null,
    images: JSON.parse(v.images_json || '[]'),
    services: JSON.parse(v.services_json || '[]'),
    is_sponsored: !!v.is_sponsored,
  };
}

// Summary counts for the admin dashboard
router.get('/stats', (_req, res) => {
  const count = (sql, ...a) => db.prepare(sql).get(...a).n;
  res.json({
    users: count('SELECT COUNT(*) n FROM users'),
    vendors_total: count('SELECT COUNT(*) n FROM vendors'),
    vendors_pending: count("SELECT COUNT(*) n FROM vendors WHERE status = 'pending'"),
    vendors_approved: count("SELECT COUNT(*) n FROM vendors WHERE status = 'approved'"),
    enquiries: count('SELECT COUNT(*) n FROM enquiries'),
  });
});

// List vendors by status (default: all), for the approval workflow
router.get('/vendors', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM vendors';
  const args = [];
  if (status) {
    sql += ' WHERE status = ?';
    args.push(String(status));
  }
  sql += ' ORDER BY created_at DESC';
  res.json(db.prepare(sql).all(...args).map(shape));
});

// Approve / reject a vendor listing
router.patch('/vendors/:id/status', (req, res) => {
  const { status } = req.body || {};
  if (!['approved', 'rejected', 'pending'].includes(status))
    return res.status(400).json({ error: 'status must be approved, rejected or pending.' });
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found.' });
  db.prepare('UPDATE vendors SET status = ? WHERE id = ?').run(status, v.id);
  res.json(shape(db.prepare('SELECT * FROM vendors WHERE id = ?').get(v.id)));
});

// Toggle sponsored flag (clearly-labelled sponsored listings)
router.patch('/vendors/:id/sponsor', (req, res) => {
  const { is_sponsored } = req.body || {};
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found.' });
  db.prepare('UPDATE vendors SET is_sponsored = ? WHERE id = ?').run(is_sponsored ? 1 : 0, v.id);
  res.json(shape(db.prepare('SELECT * FROM vendors WHERE id = ?').get(v.id)));
});

// List users
router.get('/users', (_req, res) => {
  res.json(db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all());
});

export default router;

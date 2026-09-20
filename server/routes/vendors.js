import { Router } from 'express';
import db from '../db/sqlite.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function categories() {
  return db.prepare('SELECT * FROM vendor_categories ORDER BY name').all();
}
function catName(id) {
  const c = db.prepare('SELECT name FROM vendor_categories WHERE id = ?').get(id);
  return c ? c.name : null;
}
function shape(v) {
  return {
    ...v,
    category: catName(v.category_id),
    images: JSON.parse(v.images_json || '[]'),
    services: JSON.parse(v.services_json || '[]'),
    is_sponsored: !!v.is_sponsored,
  };
}

// List vendor categories
router.get('/vendor-categories', (_req, res) => res.json(categories()));

// Public marketplace: only APPROVED vendors, with optional filters.
router.get('/vendors', (req, res) => {
  const { category, city, state, q } = req.query;
  let sql = 'SELECT * FROM vendors WHERE status = ?';
  const args = ['approved'];
  if (category) {
    sql += ' AND category_id = ?';
    args.push(Number(category));
  }
  if (city) {
    sql += ' AND lower(city) = ?';
    args.push(String(city).toLowerCase());
  }
  if (state) {
    sql += ' AND lower(state) = ?';
    args.push(String(state).toLowerCase());
  }
  if (q) {
    sql += ' AND (lower(business_name) LIKE ? OR lower(description) LIKE ?)';
    const like = `%${String(q).toLowerCase()}%`;
    args.push(like, like);
  }
  // Sponsored listings surface first but are flagged so the UI can label them.
  sql += ' ORDER BY is_sponsored DESC, created_at DESC';
  res.json(db.prepare(sql).all(...args).map(shape));
});

// Single vendor (approved, or owner/admin viewing their own)
router.get('/vendors/:id', (req, res) => {
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found.' });
  if (v.status !== 'approved') {
    // hide unapproved from the public
    return res.status(404).json({ error: 'Vendor not found or awaiting approval.' });
  }
  res.json(shape(v));
});

// Create a vendor listing (vendor account). Starts as 'pending'.
router.post('/vendors', requireAuth, (req, res) => {
  const { business_name, category_id, city, state, description, phone, email, lat, lng, images, services } =
    req.body || {};
  if (!business_name || !category_id)
    return res.status(400).json({ error: 'Business name and category are required.' });
  const info = db
    .prepare(
      `INSERT INTO vendors (owner_user_id, business_name, category_id, city, state, description, phone, email, lat, lng, images_json, services_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    )
    .run(
      req.user.id,
      business_name,
      Number(category_id),
      city || null,
      state || null,
      description || null,
      phone || null,
      email || null,
      lat != null ? Number(lat) : null,
      lng != null ? Number(lng) : null,
      JSON.stringify(images || []),
      JSON.stringify(services || [])
    );
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(shape(v));
});

// Vendor's own listings (dashboard)
router.get('/my/vendors', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM vendors WHERE owner_user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows.map(shape));
});

// Update own listing (returns to pending on edit)
router.put('/vendors/:id', requireAuth, (req, res) => {
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found.' });
  if (v.owner_user_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'You can only edit your own listing.' });
  const { business_name, category_id, city, state, description, phone, email, lat, lng, images, services } = req.body || {};
  db.prepare(
    `UPDATE vendors SET business_name=?, category_id=?, city=?, state=?, description=?, phone=?, email=?, lat=?, lng=?, images_json=?, services_json=?, status='pending' WHERE id=?`
  ).run(
    business_name ?? v.business_name,
    category_id != null ? Number(category_id) : v.category_id,
    city ?? v.city,
    state ?? v.state,
    description ?? v.description,
    phone ?? v.phone,
    email ?? v.email,
    lat != null ? Number(lat) : v.lat,
    lng != null ? Number(lng) : v.lng,
    JSON.stringify(images ?? JSON.parse(v.images_json || '[]')),
    JSON.stringify(services ?? JSON.parse(v.services_json || '[]')),
    v.id
  );
  res.json(shape(db.prepare('SELECT * FROM vendors WHERE id = ?').get(v.id)));
});

// Enquiry to a vendor (public)
router.post('/vendors/:id/enquiry', (req, res) => {
  const v = db.prepare('SELECT * FROM vendors WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'Vendor not found.' });
  const { user_name, contact, message } = req.body || {};
  if (!user_name || !message) return res.status(400).json({ error: 'Name and message are required.' });
  db.prepare('INSERT INTO enquiries (vendor_id, user_name, contact, message) VALUES (?, ?, ?, ?)').run(
    v.id,
    user_name,
    contact || null,
    message
  );
  res.status(201).json({ ok: true, message: 'Enquiry sent to the vendor (demo).' });
});

// Vendor reads enquiries for their listings
router.get('/my/enquiries', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      `SELECT e.*, v.business_name FROM enquiries e
       JOIN vendors v ON v.id = e.vendor_id
       WHERE v.owner_user_id = ? ORDER BY e.created_at DESC`
    )
    .all(req.user.id);
  res.json(rows);
});

export default router;

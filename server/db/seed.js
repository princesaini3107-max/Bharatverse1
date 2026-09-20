import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db, { initSchema } from './sqlite.js';

// Idempotent seed: safe to run on every `npm run dev`. Creates the schema,
// seeds vendor categories, demo accounts (admin/vendor/user) and a handful of
// approved + pending vendor listings so the marketplace and admin workflow are
// populated for a demo.

initSchema();

const CATEGORIES = ['Hotel', 'Restaurant', 'Local Guide', 'Handicraft Seller', 'Experience Provider'];

function seedCategories() {
  const insert = db.prepare('INSERT OR IGNORE INTO vendor_categories (name) VALUES (?)');
  const tx = db.transaction((names) => names.forEach((n) => insert.run(n)));
  tx(CATEGORIES);
}

function catId(name) {
  return db.prepare('SELECT id FROM vendor_categories WHERE name = ?').get(name).id;
}

function seedUsers() {
  const upsert = (name, email, password, role) => {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return existing.id;
    const hash = bcrypt.hashSync(password, 10);
    return db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(name, email, hash, role).lastInsertRowid;
  };
  const adminId = upsert('BharatVerse Admin', 'admin@bharatverse.in', 'admin123', 'admin');
  const vendorId = upsert('Demo Vendor', 'vendor@bharatverse.in', 'vendor123', 'vendor');
  const userId = upsert('Demo Tourist', 'user@bharatverse.in', 'user123', 'user');
  return { adminId, vendorId, userId };
}

function seedVendors(ownerId) {
  // Only seed if the vendors table is empty, so we don't duplicate on re-run.
  const count = db.prepare('SELECT COUNT(*) n FROM vendors').get().n;
  if (count > 0) return;

  const rows = [
    {
      business_name: 'Rajputana Heritage Haveli',
      category: 'Hotel', city: 'Jaipur', state: 'Rajasthan',
      description: 'A restored 19th-century haveli offering heritage rooms, a courtyard restaurant and rooftop views of the old city.',
      phone: '+91-141-000000', email: 'stay@rajputanahaveli.demo', lat: 26.9239, lng: 75.8267,
      services: ['Heritage rooms', 'Courtyard dining', 'Airport pickup', 'Guided city tours'],
      status: 'approved', is_sponsored: 1,
    },
    {
      business_name: 'Pink City Craft Bazaar',
      category: 'Handicraft Seller', city: 'Jaipur', state: 'Rajasthan',
      description: 'Family-run store for authentic Jaipur blue pottery, block-printed textiles and handmade juttis.',
      phone: '+91-141-000001', email: 'shop@pinkcitycraft.demo', lat: 26.9196, lng: 75.8200,
      services: ['Blue pottery', 'Block-print textiles', 'Worldwide shipping'],
      status: 'approved', is_sponsored: 0,
    },
    {
      business_name: 'Amritsar Langar Trail Food Walk',
      category: 'Experience Provider', city: 'Amritsar', state: 'Punjab',
      description: 'A guided evening food walk through the lanes around the Golden Temple, ending with kulcha and lassi.',
      phone: '+91-183-000002', email: 'walks@amritsarfood.demo', lat: 31.6200, lng: 74.8765,
      services: ['Evening food walk', 'Vegetarian friendly', 'Small groups'],
      status: 'approved', is_sponsored: 0,
    },
    {
      business_name: 'Ganga View Guest House',
      category: 'Hotel', city: 'Varanasi', state: 'Uttar Pradesh',
      description: 'Simple, clean rooms steps from the ghats with a terrace overlooking the Ganga aarti.',
      phone: '+91-542-000003', email: 'stay@gangaview.demo', lat: 25.3050, lng: 83.0104,
      services: ['River-view rooms', 'Boat booking', 'Aarti viewing'],
      status: 'approved', is_sponsored: 0,
    },
    {
      business_name: 'Bodhi Path Meditation Guides',
      category: 'Local Guide', city: 'Bodh Gaya', state: 'Bihar',
      description: 'Certified local guides for the Mahabodhi complex and nearby monasteries, with optional meditation sessions.',
      phone: '+91-631-000004', email: 'guide@bodhipath.demo', lat: 24.6961, lng: 84.9914,
      services: ['Heritage guiding', 'Meditation intro', 'Monastery circuit'],
      status: 'approved', is_sponsored: 0,
    },
    {
      business_name: 'Lucknow Chikan Studio',
      category: 'Handicraft Seller', city: 'Lucknow', state: 'Uttar Pradesh',
      description: 'Hand-embroidered chikankari kurtas and sarees sourced directly from women artisans.',
      phone: '+91-522-000005', email: 'studio@lucknowchikan.demo', lat: 26.8698, lng: 80.9128,
      services: ['Chikankari apparel', 'Custom orders', 'Artisan-direct'],
      status: 'approved', is_sponsored: 0,
    },
    {
      business_name: 'Old Delhi Street Food Tours',
      category: 'Experience Provider', city: 'Old Delhi', state: 'Delhi',
      description: 'A rickshaw-and-walk tour of Chandni Chowk’s legendary chaat, parathas and jalebi.',
      phone: '+91-11-000006', email: 'hello@olddelhitours.demo', lat: 28.6562, lng: 77.2410,
      services: ['Street food tour', 'Rickshaw ride', 'Spice market visit'],
      status: 'approved', is_sponsored: 1,
    },
    {
      business_name: 'Thar Desert Camp & Camel Safari',
      category: 'Experience Provider', city: 'Jaisalmer', state: 'Rajasthan',
      description: 'Overnight desert camp with folk Manganiyar music, dinner and a sunrise camel safari.',
      phone: '+91-2992-000007', email: 'camp@thardesert.demo', lat: 26.9127, lng: 70.9124,
      services: ['Desert camp', 'Camel safari', 'Folk music evening'],
      status: 'pending', is_sponsored: 0,
    },
  ];

  const insert = db.prepare(
    `INSERT INTO vendors (owner_user_id, business_name, category_id, city, state, description, phone, email, lat, lng, images_json, services_json, is_sponsored, status)
     VALUES (@owner_user_id, @business_name, @category_id, @city, @state, @description, @phone, @email, @lat, @lng, @images_json, @services_json, @is_sponsored, @status)`
  );
  const tx = db.transaction((list) => {
    list.forEach((r) =>
      insert.run({
        owner_user_id: ownerId,
        business_name: r.business_name,
        category_id: catId(r.category),
        city: r.city,
        state: r.state,
        description: r.description,
        phone: r.phone,
        email: r.email,
        lat: r.lat,
        lng: r.lng,
        images_json: '[]',
        services_json: JSON.stringify(r.services),
        is_sponsored: r.is_sponsored,
        status: r.status,
      })
    );
  });
  tx(rows);
}

seedCategories();
const { vendorId } = seedUsers();
seedVendors(vendorId);

console.log('[seed] BharatVerse database ready.');
console.log('[seed] Demo accounts:');
console.log('        admin  -> admin@bharatverse.in / admin123');
console.log('        vendor -> vendor@bharatverse.in / vendor123');
console.log('        user   -> user@bharatverse.in / user123');

-- BharatVerse relational schema (SQLite)
-- Holds the data that CHANGES at runtime: accounts, vendor listings,
-- enquiries, quiz results and saved travel plans. Static cultural content
-- (states, cities, places, articles, museum, artisans, heritage, quizzes)
-- is served from seed JSON in /server/data and does not live here.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','vendor','admin')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vendor_categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vendors (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  category_id   INTEGER REFERENCES vendor_categories(id),
  city          TEXT,
  state         TEXT,
  description   TEXT,
  phone         TEXT,
  email         TEXT,
  lat           REAL,
  lng           REAL,
  images_json   TEXT DEFAULT '[]',
  services_json TEXT DEFAULT '[]',
  is_sponsored  INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id  INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_name  TEXT NOT NULL,
  contact    TEXT,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quiz_id   TEXT NOT NULL,
  score     INTEGER NOT NULL,
  total     INTEGER NOT NULL,
  taken_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS travel_plans (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
  destination    TEXT NOT NULL,
  days           INTEGER NOT NULL,
  budget         TEXT,
  interests_json TEXT DEFAULT '[]',
  itinerary_json TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vendors_status   ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_vendor ON enquiries(vendor_id);

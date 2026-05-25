-- Venture — PostgreSQL Schema (Firebase Data Connect)
-- -------------------------------------------------------

-- Users
CREATE TABLE users (
  id            TEXT PRIMARY KEY,        -- Firebase Auth UID
  email         TEXT NOT NULL,
  currency      TEXT DEFAULT 'GBP',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User interest preferences
CREATE TABLE user_interests (
  user_id       TEXT REFERENCES users(id),
  interest      TEXT NOT NULL,           -- 'hiking','food','museums' etc.
  PRIMARY KEY (user_id, interest)
);

-- Trips
CREATE TABLE trips (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT REFERENCES users(id),
  name          TEXT,                    -- optional custom name
  is_multi_city BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Destinations (a trip has 1+ destinations)
CREATE TABLE destinations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id       UUID REFERENCES trips(id) ON DELETE CASCADE,
  city          TEXT NOT NULL,
  country       TEXT,
  country_code  TEXT,                    -- for flag emoji
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  sort_order    INT DEFAULT 0,
  research_done BOOLEAN DEFAULT FALSE,
  research_at   TIMESTAMPTZ
);

-- Spots (researched places, cached per city)
CREATE TABLE spots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city            TEXT NOT NULL,         -- cache key — shared across all trips to same city
  name            TEXT NOT NULL,
  description     TEXT,
  why_hidden      TEXT,                  -- "Why it's hidden" blurb
  hiddenness_score INT CHECK (hiddenness_score BETWEEN 1 AND 10),
  hiddenness_label TEXT,                -- 'Tourist Staple', 'Hidden Gem' etc.
  lat             DECIMAL(9,6),
  lng             DECIMAL(9,6),
  address         TEXT,
  entry_price     DECIMAL(8,2),         -- per person, null if free
  currency        TEXT DEFAULT 'EUR',
  interests       TEXT[],               -- array: ['hiking','nature']
  sources         JSONB,                -- [{label, url}]
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast city lookups (the cache query)
CREATE INDEX idx_spots_city ON spots(city);

-- Day plans (one per trip day)
CREATE TABLE day_plans (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  plan_date      DATE NOT NULL,
  day_number     INT NOT NULL
);

-- Spots added to a day plan
CREATE TABLE day_plan_spots (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_plan_id  UUID REFERENCES day_plans(id) ON DELETE CASCADE,
  spot_id      UUID REFERENCES spots(id),
  time_of_day  TEXT CHECK (time_of_day IN ('morning','afternoon','evening')),
  sort_order   INT DEFAULT 0
);

-- City day passes (curated data — seeded, not AI-generated)
CREATE TABLE city_passes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city               TEXT NOT NULL,
  name               TEXT NOT NULL,           -- 'Amsterdam City Card'
  durations          JSONB,                   -- [{hours: 24, price: 70}, {hours: 48, price: 90}]
  currency           TEXT DEFAULT 'EUR',
  buy_url            TEXT,
  covers             TEXT[],                  -- spot names it covers (matched against spots table)
  includes_transport BOOLEAN DEFAULT FALSE
);

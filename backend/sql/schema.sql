-- Recycle Marketplace Schema
-- Enable extensions (run once)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('seller','collector','admin')),
  stripe_account_id TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- profiles (optional)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT now()
);

-- materials
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- pricing_rates
CREATE TABLE IF NOT EXISTS pricing_rates (
  id SERIAL PRIMARY KEY,
  material_id INT REFERENCES materials(id),
  rate_per_unit NUMERIC(10,2) NOT NULL,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE NULL,
  source TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  material_id INT REFERENCES materials(id),
  quantity NUMERIC(10,3) NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  photo_path TEXT,
  estimated_price NUMERIC(12,2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','cancelled','collected')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- pickup_requests
CREATE TABLE IF NOT EXISTS pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id),
  scheduled_at TIMESTAMP,
  status TEXT NOT NULL CHECK (status IN ('requested','assigned','in_progress','completed','cancelled')),
  assigned_collector_id UUID REFERENCES users(id),
  pickup_address TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- jobs_history
CREATE TABLE IF NOT EXISTS jobs_history (
  id SERIAL PRIMARY KEY,
  pickup_request_id UUID REFERENCES pickup_requests(id),
  old_status TEXT,
  new_status TEXT,
  changed_by UUID REFERENCES users(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_request_id UUID REFERENCES pickup_requests(id),
  amount NUMERIC(12,2),
  currency TEXT DEFAULT 'INR',
  status TEXT CHECK (status IN ('pending','succeeded','failed','refunded')),
  stripe_charge_id TEXT,
  paid_to_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- collector_locations
CREATE TABLE IF NOT EXISTS collector_locations (
  collector_id UUID PRIMARY KEY REFERENCES users(id),
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  updated_at TIMESTAMP DEFAULT now()
);

-- files (local uploads metadata)
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  path TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- notifications (simple records)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT,
  title TEXT,
  body TEXT,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
DROP TRIGGER IF EXISTS update_collector_locations_updated_at ON collector_locations;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collector_locations_updated_at BEFORE UPDATE ON collector_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_seller_id ON pickup_requests(seller_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_collector ON pickup_requests(assigned_collector_id);
CREATE INDEX IF NOT EXISTS idx_payments_pickup_request ON payments(pickup_request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rates_material ON pricing_rates(material_id);

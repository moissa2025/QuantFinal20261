CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  asset_class TEXT NOT NULL,
  exchange TEXT,
  currency TEXT NOT NULL,
  sector TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);


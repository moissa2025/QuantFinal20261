CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id),
  ts TIMESTAMP NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  change_abs DOUBLE PRECISION,
  change_pct DOUBLE PRECISION,
  volume DOUBLE PRECISION
);


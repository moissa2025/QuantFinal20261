CREATE TABLE quant_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id),
  as_of TIMESTAMP NOT NULL,
  score DOUBLE PRECISION,
  label TEXT,
  explanation TEXT
);


CREATE TABLE assets (
  id UUID PRIMARY KEY,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  asset_class TEXT NOT NULL,
  exchange TEXT,
  currency TEXT NOT NULL,
  sector TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  ts TIMESTAMP NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  change_abs DOUBLE PRECISION,
  change_pct DOUBLE PRECISION,
  volume DOUBLE PRECISION
);

CREATE TABLE news_items (
  id UUID PRIMARY KEY,
  source TEXT,
  source_id TEXT,
  title TEXT,
  body TEXT,
  url TEXT,
  published_at TIMESTAMP,
  summary_ai TEXT,
  sentiment TEXT,
  tags_assets TEXT[],
  tags_themes TEXT[]
);

CREATE TABLE articles (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body_html TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMP,
  assets TEXT[],
  themes TEXT[]
);

CREATE TABLE themes (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);


CREATE TABLE quant_scores (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  as_of TIMESTAMP NOT NULL,
  score DOUBLE PRECISION,
  label TEXT,
  explanation TEXT
);



CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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


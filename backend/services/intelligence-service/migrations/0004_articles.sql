CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  body_html TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMP,
  assets TEXT[],
  themes TEXT[]
);


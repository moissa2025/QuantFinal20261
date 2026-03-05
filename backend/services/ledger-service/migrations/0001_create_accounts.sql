CREATE TABLE accounts (
    id          UUID PRIMARY KEY,
    code        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    currency    TEXT NOT NULL,
    book        TEXT NOT NULL CHECK (book IN ('production', 'risk_shadow')),
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


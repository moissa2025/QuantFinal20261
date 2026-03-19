CREATE SCHEMA IF NOT EXISTS ledger;

CREATE TABLE ledger.accounts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    currency    TEXT NOT NULL,
    book        TEXT NOT NULL CHECK (book IN ('production', 'risk_shadow')),
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


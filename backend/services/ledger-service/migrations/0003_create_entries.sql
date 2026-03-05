CREATE TABLE entries (
    id              UUID PRIMARY KEY,
    journal_id      UUID NOT NULL REFERENCES journal(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    side            TEXT NOT NULL CHECK (side IN ('debit', 'credit')),
    amount          BIGINT NOT NULL,
    currency        TEXT NOT NULL,
    risk_tag        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


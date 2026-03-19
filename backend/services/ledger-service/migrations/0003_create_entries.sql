CREATE TABLE ledger.entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id      UUID NOT NULL REFERENCES ledger.journal(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES ledger.accounts(id),
    side            TEXT NOT NULL CHECK (side IN ('debit', 'credit')),
    amount          BIGINT NOT NULL,
    currency        TEXT NOT NULL,
    risk_tag        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


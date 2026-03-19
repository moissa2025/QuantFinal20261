CREATE TABLE ledger.journal (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_type        TEXT NOT NULL,
    external_ref    TEXT,
    status          TEXT NOT NULL DEFAULT 'posted',
    reversal_of     UUID REFERENCES ledger.journal(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


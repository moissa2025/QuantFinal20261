CREATE TABLE journal (
    id              UUID PRIMARY KEY,
    txn_type        TEXT NOT NULL,
    external_ref    TEXT,
    status          TEXT NOT NULL DEFAULT 'posted',
    reversal_of     UUID REFERENCES journal(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


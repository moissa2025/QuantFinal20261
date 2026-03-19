CREATE TABLE reconciliation.reconciliation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
    source TEXT NOT NULL, -- ledger, wallet, trading, external
    reference TEXT NOT NULL,
    expected_amount NUMERIC,
    actual_amount NUMERIC,
    status TEXT NOT NULL DEFAULT 'mismatch', -- match, mismatch, resolved
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recon_items_run_id
    ON reconciliation.reconciliation_items(run_id);


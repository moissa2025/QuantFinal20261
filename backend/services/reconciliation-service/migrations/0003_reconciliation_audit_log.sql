CREATE TABLE reconciliation.reconciliation_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recon_audit_run_id
    ON reconciliation.reconciliation_audit_log(run_id);


-- 0009_reconciliation.sql
-- Reconciliation domain

SET DATABASE = gqx_db;

-- Reconciliation Runs
CREATE TABLE IF NOT EXISTS reconciliation.reconciliation_runs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_type STRING NOT NULL,
    status STRING NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    completed_at TIMESTAMPTZ NULL,
    metadata JSONB NULL,
    CONSTRAINT reconciliation_runs_pkey PRIMARY KEY (id)
);

-- Reconciliation Items
CREATE TABLE IF NOT EXISTS reconciliation.reconciliation_items (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    source STRING NOT NULL,
    reference STRING NOT NULL,
    amount INT8 NOT NULL,
    currency STRING NOT NULL,
    status STRING NOT NULL DEFAULT 'unmatched',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT reconciliation_items_pkey PRIMARY KEY (id),
    CONSTRAINT reconciliation_items_run_id_fkey FOREIGN KEY (run_id)
        REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
    INDEX idx_reconciliation_items_run_id (run_id)
);

-- Reconciliation Audit Log
CREATE TABLE IF NOT EXISTS reconciliation.reconciliation_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    event STRING NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT reconciliation_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT reconciliation_audit_log_run_id_fkey FOREIGN KEY (run_id)
        REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
    INDEX idx_reconciliation_audit_log_run_id (run_id)
);


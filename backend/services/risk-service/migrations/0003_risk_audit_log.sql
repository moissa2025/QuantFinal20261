CREATE TABLE risk.risk_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT,
    side TEXT,
    size NUMERIC,
    price NUMERIC,
    allowed BOOLEAN NOT NULL,
    reason TEXT,
    exposure_before NUMERIC,
    exposure_after NUMERIC,
    limit_used NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_risk_audit_user_id
    ON risk.risk_audit_log(user_id);


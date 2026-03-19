CREATE SCHEMA IF NOT EXISTS risk;

CREATE TABLE risk.risk_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT,
    max_order_size NUMERIC,
    max_notional NUMERIC,
    max_leverage NUMERIC,
    max_daily_loss NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_risk_limits_user_id
    ON risk.risk_limits(user_id);

CREATE INDEX idx_risk_limits_symbol
    ON risk.risk_limits(symbol);


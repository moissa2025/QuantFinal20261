-- 0001_create_risk_limits.sql

CREATE TABLE risk_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT,
    max_order_size NUMERIC,
    max_notional NUMERIC,
    max_leverage NUMERIC,
    max_daily_loss NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_limits_user_id
    ON risk_limits(user_id);

CREATE INDEX idx_risk_limits_symbol
    ON risk_limits(symbol);


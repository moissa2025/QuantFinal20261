CREATE TABLE risk.risk_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    position_size NUMERIC NOT NULL DEFAULT 0,
    pending_order_size NUMERIC NOT NULL DEFAULT 0,
    net_exposure NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_risk_exposures_user_symbol
    ON risk.risk_exposures(user_id, symbol);


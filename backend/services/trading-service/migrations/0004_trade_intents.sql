CREATE TABLE trading.trade_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    strategy_id UUID,
    mandate_id UUID,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,               -- BUY / SELL
    action TEXT NOT NULL,             -- OPEN / CLOSE / REDUCE / INCREASE
    quantity NUMERIC NOT NULL,
    order_type TEXT NOT NULL,         -- LIMIT / MARKET
    limit_price NUMERIC,
    metadata JSONB,
    status TEXT NOT NULL DEFAULT 'PENDING',   -- PENDING / APPROVED / REJECTED / EXECUTED
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_intents_customer_id ON trading.trade_intents(customer_id);
CREATE INDEX idx_trade_intents_status ON trading.trade_intents(status);


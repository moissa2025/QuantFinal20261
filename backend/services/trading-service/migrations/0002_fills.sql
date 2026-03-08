-- 0002_create_fills.sql

CREATE TABLE fills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    maker_order_id UUID,
    taker_order_id UUID,
    symbol TEXT NOT NULL,
    price NUMERIC NOT NULL,
    size NUMERIC NOT NULL,
    role TEXT NOT NULL,              -- MAKER / TAKER
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fills_order_id ON fills(order_id);
CREATE INDEX idx_fills_symbol ON fills(symbol);


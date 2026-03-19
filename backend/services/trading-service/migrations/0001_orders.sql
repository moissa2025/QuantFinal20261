CREATE SCHEMA IF NOT EXISTS trading;

CREATE TABLE trading.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,              -- BUY / SELL
    order_type TEXT NOT NULL,        -- LIMIT / MARKET
    tif TEXT NOT NULL,               -- GTC / IOC / FOK
    price NUMERIC,
    size NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_id ON trading.orders(customer_id);
CREATE INDEX idx_orders_symbol ON trading.orders(symbol);
CREATE INDEX idx_orders_status ON trading.orders(status);


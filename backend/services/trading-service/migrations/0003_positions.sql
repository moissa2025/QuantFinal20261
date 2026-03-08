-- 0003_create_positions.sql

CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL DEFAULT 'FLAT',   -- LONG / SHORT / FLAT
    quantity NUMERIC NOT NULL DEFAULT 0,
    avg_entry_price NUMERIC NOT NULL DEFAULT 0,
    realised_pnl NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_positions_customer_symbol
    ON positions(customer_id, symbol);


-- 0011_trading.sql
-- Trading domain: instruments, order book, orders, trades, positions

SET DATABASE = gqx_db;

-- Instruments
CREATE TABLE IF NOT EXISTS trading.instruments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    symbol STRING NOT NULL,
    name STRING NOT NULL,
    asset_type STRING NOT NULL,
    currency STRING NOT NULL,
    tick_size DECIMAL NOT NULL DEFAULT 0.01,
    lot_size INT8 NOT NULL DEFAULT 1,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT instruments_pkey PRIMARY KEY (id),
    UNIQUE INDEX instruments_symbol_key (symbol)
);

-- Order Book Snapshots
CREATE TABLE IF NOT EXISTS trading.order_book (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    instrument_id UUID NOT NULL,
    bids JSONB NOT NULL,
    asks JSONB NOT NULL,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT order_book_pkey PRIMARY KEY (id),
    CONSTRAINT order_book_instrument_id_fkey FOREIGN KEY (instrument_id)
        REFERENCES trading.instruments(id) ON DELETE CASCADE,
    INDEX idx_order_book_instrument_id (instrument_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS trading.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    instrument_id UUID NOT NULL,
    side STRING NOT NULL, -- buy/sell
    order_type STRING NOT NULL, -- market/limit
    price DECIMAL NULL,
    quantity INT8 NOT NULL,
    filled_quantity INT8 NOT NULL DEFAULT 0,
    status STRING NOT NULL DEFAULT 'pending',
    time_in_force STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_instrument_id_fkey FOREIGN KEY (instrument_id)
        REFERENCES trading.instruments(id),
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_instrument_id (instrument_id)
);

-- Trades
CREATE TABLE IF NOT EXISTS trading.trades (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    buy_order_id UUID NOT NULL,
    sell_order_id UUID NOT NULL,
    instrument_id UUID NOT NULL,
    price DECIMAL NOT NULL,
    quantity INT8 NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT trades_pkey PRIMARY KEY (id),
    CONSTRAINT trades_buy_order_id_fkey FOREIGN KEY (buy_order_id)
        REFERENCES trading.orders(id),
    CONSTRAINT trades_sell_order_id_fkey FOREIGN KEY (sell_order_id)
        REFERENCES trading.orders(id),
    CONSTRAINT trades_instrument_id_fkey FOREIGN KEY (instrument_id)
        REFERENCES trading.instruments(id),
    INDEX idx_trades_instrument_id (instrument_id)
);

-- Positions
CREATE TABLE IF NOT EXISTS trading.positions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    instrument_id UUID NOT NULL,
    quantity INT8 NOT NULL DEFAULT 0,
    average_price DECIMAL NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT positions_pkey PRIMARY KEY (id),
    INDEX idx_positions_user_id (user_id),
    INDEX idx_positions_instrument_id (instrument_id)
);


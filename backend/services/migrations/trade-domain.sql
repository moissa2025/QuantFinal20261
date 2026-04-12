USE globalquantx_db_trade;

CREATE SCHEMA IF NOT EXISTS trading;

CREATE TABLE trading.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    order_type TEXT NOT NULL,
    tif TEXT NOT NULL,
    price NUMERIC,
    size NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer_id ON trading.orders(customer_id);
CREATE INDEX idx_orders_symbol ON trading.orders(symbol);
CREATE INDEX idx_orders_status ON trading.orders(status);

CREATE TABLE trading.fills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES trading.orders(id) ON DELETE CASCADE,
    maker_order_id UUID,
    taker_order_id UUID,
    symbol TEXT NOT NULL,
    price NUMERIC NOT NULL,
    size NUMERIC NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fills_order_id ON trading.fills(order_id);
CREATE INDEX idx_fills_symbol ON trading.fills(symbol);

CREATE TABLE trading.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL DEFAULT 'FLAT',
    quantity NUMERIC NOT NULL DEFAULT 0,
    avg_entry_price NUMERIC NOT NULL DEFAULT 0,
    realised_pnl NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_positions_customer_symbol
    ON trading.positions(customer_id, symbol);

CREATE TABLE trading.trade_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    strategy_id UUID,
    mandate_id UUID,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    action TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    order_type TEXT NOT NULL,
    limit_price NUMERIC,
    metadata JSONB,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_intents_customer_id ON trading.trade_intents(customer_id);
CREATE INDEX idx_trade_intents_status ON trading.trade_intents(status);

CREATE TABLE trading.execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID REFERENCES trading.trade_intents(id) ON DELETE SET NULL,
    order_id UUID REFERENCES trading.orders(id) ON DELETE SET NULL,
    venue_order_id TEXT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_execution_logs_order_id ON trading.execution_logs(order_id);
CREATE INDEX idx_execution_logs_intent_id ON trading.execution_logs(intent_id);

CREATE SCHEMA IF NOT EXISTS risk;

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

CREATE SCHEMA IF NOT EXISTS ledger;

CREATE TABLE ledger.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    currency TEXT NOT NULL,
    book TEXT NOT NULL CHECK (book IN ('production', 'risk_shadow')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger.journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txn_type TEXT NOT NULL,
    external_ref TEXT,
    status TEXT NOT NULL DEFAULT 'posted',
    reversal_of UUID REFERENCES ledger.journal(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger.entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL REFERENCES ledger.journal(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES ledger.accounts(id),
    side TEXT NOT NULL CHECK (side IN ('debit', 'credit')),
    amount BIGINT NOT NULL,
    currency TEXT NOT NULL,
    risk_tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_entries_journal_id ON ledger.entries(journal_id);
CREATE INDEX idx_entries_account_id ON ledger.entries(account_id);
CREATE INDEX idx_entries_currency ON ledger.entries(currency);

CREATE INDEX idx_journal_external_ref ON ledger.journal(external_ref);
CREATE INDEX idx_accounts_code ON ledger.accounts(code);

CREATE TABLE ledger.account_balances (
    account_id UUID PRIMARY KEY REFERENCES ledger.accounts(id),
    balance BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO ledger.accounts (id, code, name, currency, book)
VALUES
    (gen_random_uuid(), 'SYS_TREASURY_USD', 'System Treasury USD', 'USD', 'production'),
    (gen_random_uuid(), 'SYS_TREASURY_USD_RS', 'System Treasury USD (Risk Shadow)', 'USD', 'risk_shadow');

CREATE SCHEMA IF NOT EXISTS wallet;

CREATE TABLE wallet.wallet_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    balance NUMERIC(18, 6) NOT NULL DEFAULT 0,
    hold NUMERIC(18, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet.wallet_transactions (
    id BIGINT PRIMARY KEY DEFAULT unique_rowid(),
    account_id UUID NOT NULL REFERENCES wallet.wallet_accounts(id),
    amount NUMERIC(18, 6) NOT NULL,
    tx_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    request_hash TEXT NOT NULL,
    response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


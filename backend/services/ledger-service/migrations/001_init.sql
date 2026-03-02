-- Enable UUID + crypto extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------------------------------------------
-- CURRENCIES
-- Defines scale (minor units) for each currency.
------------------------------------------------------------
CREATE TABLE currencies (
    code TEXT PRIMARY KEY,               -- e.g. USD, BTC, ETH
    scale SMALLINT NOT NULL CHECK (scale >= 0 AND scale <= 18),
    description TEXT
);

INSERT INTO currencies (code, scale, description) VALUES
('USD', 2, 'US Dollar'),
('USDT', 6, 'Tether USD'),
('BTC', 8, 'Bitcoin');

------------------------------------------------------------
-- ACCOUNTS
-- Each user or system component has multiple accounts.
------------------------------------------------------------
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,                        -- nullable for system accounts
    code TEXT NOT NULL,                  -- e.g. CASH, FEES, PNL
    currency TEXT NOT NULL REFERENCES currencies(code),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, code, currency)
);

------------------------------------------------------------
-- JOURNALS
-- Atomic events grouping multiple entries.
------------------------------------------------------------
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_type TEXT NOT NULL,          -- e.g. TRADE_SETTLEMENT
    reference_id TEXT,                   -- e.g. trade_id
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------
-- ENTRIES (DOUBLE-ENTRY)
-- Uses BIGINT minor units for perfect precision.
------------------------------------------------------------
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    direction TEXT NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
    amount BIGINT NOT NULL CHECK (amount > 0),  -- always positive
    currency TEXT NOT NULL REFERENCES currencies(code),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------
-- BALANCES (MATERIALIZED)
-- Optional: stores last-known balance for fast reads.
------------------------------------------------------------
CREATE TABLE balances (
    account_id UUID PRIMARY KEY REFERENCES accounts(id),
    balance BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

------------------------------------------------------------
-- AUDIT LOGS
-- Immutable append-only logs.
------------------------------------------------------------
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


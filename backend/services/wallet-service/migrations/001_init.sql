CREATE SCHEMA IF NOT EXISTS wallet;

-- WALLET ACCOUNTS
CREATE TABLE wallet.wallet_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    balance NUMERIC(18, 6) NOT NULL DEFAULT 0,
    hold NUMERIC(18, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- WALLET TRANSACTIONS
CREATE TABLE wallet.wallet_transactions (
    id BIGINT PRIMARY KEY DEFAULT unique_rowid(),
    account_id UUID NOT NULL REFERENCES wallet.wallet_accounts(id),
    amount NUMERIC(18, 6) NOT NULL,
    tx_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- IDEMPOTENCY KEYS
CREATE TABLE wallet.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    request_hash TEXT NOT NULL,
    response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


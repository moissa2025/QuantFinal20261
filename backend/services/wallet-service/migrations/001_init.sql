CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE wallet_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    balance NUMERIC(18, 6) NOT NULL DEFAULT 0,
    hold NUMERIC(18, 6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES wallet_accounts(id),
    amount NUMERIC(18, 6) NOT NULL,
    tx_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


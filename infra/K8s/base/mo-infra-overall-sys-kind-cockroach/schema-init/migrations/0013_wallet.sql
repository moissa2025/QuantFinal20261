-- 0013_wallet.sql
-- Wallet domain: wallets, balances, transactions

SET DATABASE = gqx_db;

-- Wallets
CREATE TABLE IF NOT EXISTS wallet.wallets (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    currency STRING NOT NULL,
    status STRING NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT wallets_pkey PRIMARY KEY (id),
    INDEX idx_wallets_user_id (user_id)
);

-- Wallet Balances
CREATE TABLE IF NOT EXISTS wallet.wallet_balances (
    wallet_id UUID NOT NULL,
    available INT8 NOT NULL DEFAULT 0,
    pending INT8 NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT wallet_balances_pkey PRIMARY KEY (wallet_id),
    CONSTRAINT wallet_balances_wallet_id_fkey FOREIGN KEY (wallet_id)
        REFERENCES wallet.wallets(id) ON DELETE CASCADE
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet.wallet_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    txn_type STRING NOT NULL, -- deposit, withdrawal, transfer, adjustment
    amount INT8 NOT NULL,
    currency STRING NOT NULL,
    reference STRING NULL,
    status STRING NOT NULL DEFAULT 'completed',
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id)
        REFERENCES wallet.wallets(id) ON DELETE CASCADE,
    INDEX idx_wallet_transactions_wallet_id (wallet_id)
);


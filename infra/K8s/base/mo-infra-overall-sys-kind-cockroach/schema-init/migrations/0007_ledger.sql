-- 0007_ledger.sql
-- Ledger & Accounting domain

SET DATABASE = gqx_db;

-- Accounts
CREATE TABLE IF NOT EXISTS ledger.accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    code STRING NOT NULL,
    name STRING NOT NULL,
    currency STRING NOT NULL,
    book STRING NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    UNIQUE INDEX accounts_code_key (code),
    INDEX idx_accounts_code (code),
    CONSTRAINT check_book CHECK (book IN ('production', 'risk_shadow'))
);

-- Journal
CREATE TABLE IF NOT EXISTS ledger.journal (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    txn_type STRING NOT NULL,
    external_ref STRING NULL,
    status STRING NOT NULL DEFAULT 'posted',
    reversal_of UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT journal_pkey PRIMARY KEY (id),
    CONSTRAINT journal_reversal_of_fkey FOREIGN KEY (reversal_of)
        REFERENCES ledger.journal(id),
    INDEX idx_journal_external_ref (external_ref)
);

-- Entries
CREATE TABLE IF NOT EXISTS ledger.entries (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL,
    account_id UUID NOT NULL,
    side STRING NOT NULL,
    amount INT8 NOT NULL,
    currency STRING NOT NULL,
    risk_tag STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT entries_pkey PRIMARY KEY (id),
    CONSTRAINT entries_journal_id_fkey FOREIGN KEY (journal_id)
        REFERENCES ledger.journal(id) ON DELETE CASCADE,
    CONSTRAINT entries_account_id_fkey FOREIGN KEY (account_id)
        REFERENCES ledger.accounts(id),
    INDEX idx_entries_journal_id (journal_id),
    INDEX idx_entries_account_id (account_id),
    INDEX idx_entries_currency (currency),
    CONSTRAINT check_side CHECK (side IN ('debit', 'credit'))
);

-- Account Balances
CREATE TABLE IF NOT EXISTS ledger.account_balances (
    account_id UUID NOT NULL,
    balance INT8 NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT account_balances_pkey PRIMARY KEY (account_id),
    CONSTRAINT account_balances_account_id_fkey FOREIGN KEY (account_id)
        REFERENCES ledger.accounts(id)
);


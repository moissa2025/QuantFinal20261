-- SQLx-Compatible PostgreSQL Schema
-- DO NOT APPLY TO COCKROACHDB
-- Used ONLY for: cargo sqlx prepare --offline --schema-file backend/schema_sqlx_postgres.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS aml;
CREATE SCHEMA IF NOT EXISTS api;
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS kyc;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS onboarding;
CREATE SCHEMA IF NOT EXISTS reconciliation;
CREATE SCHEMA IF NOT EXISTS risk;
CREATE SCHEMA IF NOT EXISTS trading;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS wallet;
CREATE SCHEMA IF NOT EXISTS intelligence;

-- AML

CREATE TABLE aml.aml_alerts (
    id UUID NOT NULL,
    user_id UUID NOT NULL,
    alert_type TEXT NOT NULL,
    risk_score BIGINT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT aml_alerts_pkey PRIMARY KEY (id)
);

CREATE TABLE aml.aml_sar_reports (
    id UUID NOT NULL,
    alert_id UUID NOT NULL,
    narrative TEXT NOT NULL,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT aml_sar_reports_pkey PRIMARY KEY (id),
    CONSTRAINT aml_sar_reports_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES aml.aml_alerts(id)
);

-- API

CREATE TABLE api.request_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id TEXT,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    status BIGINT NOT NULL,
    latency_ms BIGINT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT request_log_pkey PRIMARY KEY (id)
);

CREATE TABLE api.rate_limit (
    user_id TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    request_count BIGINT NOT NULL,
    CONSTRAINT rate_limit_pkey PRIMARY KEY (user_id)
);

CREATE TABLE api.api_keys (
    key_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    hashed_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used TIMESTAMPTZ,
    CONSTRAINT api_keys_pkey PRIMARY KEY (key_id)
);

-- AUTH

CREATE TABLE auth.users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    disabled BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE auth.roles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

CREATE TABLE auth.user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE
);

CREATE TABLE auth.credentials (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    password_hash TEXT NOT NULL,
    password_algo TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT credentials_pkey PRIMARY KEY (id),
    CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE auth.sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '1 hour'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked BOOLEAN NOT NULL DEFAULT false,
    last_activity_at TIMESTAMPTZ,
    ip TEXT,
    device_ua_hash TEXT,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT sessions_session_token_key UNIQUE (session_token)
);

CREATE TABLE auth.refresh_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    ciphertext BYTEA NOT NULL,
    nonce BYTEA NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false,
    replaced_by UUID,
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT refresh_tokens_replaced_by_fkey FOREIGN KEY (replaced_by) REFERENCES auth.refresh_tokens(id)
);

CREATE TABLE auth.password_reset_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE auth.email_verification_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE auth.login_attempts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT,
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT login_attempts_pkey PRIMARY KEY (id)
);

CREATE TABLE auth.audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE auth.event_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT event_log_pkey PRIMARY KEY (id)
);

CREATE TABLE auth.user_profile (
    user_id UUID NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    country TEXT,
    timezone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_profile_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE auth.user_preferences (
    user_id UUID NOT NULL,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
    dark_mode BOOLEAN NOT NULL DEFAULT false,
    language TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE auth.service_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT service_accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE auth.api_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    service_account_id UUID NOT NULL,
    key_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT api_keys_pkey PRIMARY KEY (id),
    CONSTRAINT api_keys_service_account_id_fkey FOREIGN KEY (service_account_id) REFERENCES auth.service_accounts(id) ON DELETE CASCADE
);

-- KYC

CREATE TABLE kyc.kyc_records (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    provider TEXT,
    provider_reference TEXT,
    risk_score BIGINT DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT kyc_records_pkey PRIMARY KEY (id)
);

CREATE TABLE kyc.kyc_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploaded',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT kyc_documents_pkey PRIMARY KEY (id),
    CONSTRAINT kyc_documents_kyc_id_fkey FOREIGN KEY (kyc_id) REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
);

CREATE TABLE kyc.kyc_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL,
    event TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT kyc_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT kyc_audit_log_kyc_id_fkey FOREIGN KEY (kyc_id) REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
);

-- LEDGER

CREATE TABLE ledger.accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    currency TEXT NOT NULL,
    book TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT accounts_code_key UNIQUE (code),
    CONSTRAINT check_book CHECK (book IN ('production', 'risk_shadow'))
);

CREATE TABLE ledger.journal (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    txn_type TEXT NOT NULL,
    external_ref TEXT,
    status TEXT NOT NULL DEFAULT 'posted',
    reversal_of UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT journal_pkey PRIMARY KEY (id),
    CONSTRAINT journal_reversal_of_fkey FOREIGN KEY (reversal_of) REFERENCES ledger.journal(id)
);

CREATE TABLE ledger.entries (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL,
    account_id UUID NOT NULL,
    side TEXT NOT NULL,
    amount BIGINT NOT NULL,
    currency TEXT NOT NULL,
    risk_tag TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT entries_pkey PRIMARY KEY (id),
    CONSTRAINT entries_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES ledger.journal(id) ON DELETE CASCADE,
    CONSTRAINT entries_account_id_fkey FOREIGN KEY (account_id) REFERENCES ledger.accounts(id),
    CONSTRAINT check_side CHECK (side IN ('debit', 'credit'))
);

CREATE TABLE ledger.account_balances (
    account_id UUID NOT NULL,
    balance BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT account_balances_pkey PRIMARY KEY (account_id),
    CONSTRAINT account_balances_account_id_fkey FOREIGN KEY (account_id) REFERENCES ledger.accounts(id)
);

-- ONBOARDING

CREATE TABLE onboarding.onboarding_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    current_step TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT onboarding_sessions_pkey PRIMARY KEY (id)
);

CREATE TABLE onboarding.onboarding_steps (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    step_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    CONSTRAINT onboarding_steps_pkey PRIMARY KEY (id),
    CONSTRAINT onboarding_steps_session_id_fkey FOREIGN KEY (session_id) REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE
);

CREATE TABLE onboarding.onboarding_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    event TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT onboarding_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT onboarding_audit_log_session_id_fkey FOREIGN KEY (session_id) REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE
);

-- RECONCILIATION

CREATE TABLE reconciliation.reconciliation_runs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    CONSTRAINT reconciliation_runs_pkey PRIMARY KEY (id)
);

CREATE TABLE reconciliation.reconciliation_items (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    source TEXT NOT NULL,
    reference TEXT NOT NULL,
    expected_amount NUMERIC,
    actual_amount NUMERIC,
    status TEXT NOT NULL DEFAULT 'mismatch',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT reconciliation_items_pkey PRIMARY KEY (id),
    CONSTRAINT reconciliation_items_run_id_fkey FOREIGN KEY (run_id) REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE
);

CREATE TABLE reconciliation.reconciliation_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    event TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT reconciliation_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT reconciliation_audit_log_run_id_fkey FOREIGN KEY (run_id) REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE
);

-- RISK

CREATE TABLE risk.risk_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT,
    max_order_size NUMERIC,
    max_notional NUMERIC,
    max_leverage NUMERIC,
    max_daily_loss NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT risk_limits_pkey PRIMARY KEY (id)
);

CREATE TABLE risk.risk_exposures (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    position_size NUMERIC NOT NULL DEFAULT 0,
    pending_order_size NUMERIC NOT NULL DEFAULT 0,
    net_exposure NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT risk_exposures_pkey PRIMARY KEY (id)
);

CREATE TABLE risk.risk_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT risk_audit_log_pkey PRIMARY KEY (id)
);

-- TRADING

CREATE TABLE trading.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    order_type TEXT NOT NULL,
    tif TEXT NOT NULL,
    price NUMERIC,
    size NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id)
);

CREATE TABLE trading.fills (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    maker_order_id UUID,
    taker_order_id UUID,
    symbol TEXT NOT NULL,
    price NUMERIC NOT NULL,
    size NUMERIC NOT NULL,
    "role" TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fills_pkey PRIMARY KEY (id),
    CONSTRAINT fills_order_id_fkey FOREIGN KEY (order_id) REFERENCES trading.orders(id) ON DELETE CASCADE
);

CREATE TABLE trading.positions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL DEFAULT 'FLAT',
    quantity NUMERIC NOT NULL DEFAULT 0,
    avg_entry_price NUMERIC NOT NULL DEFAULT 0,
    realised_pnl NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT positions_pkey PRIMARY KEY (id),
    CONSTRAINT idx_positions_customer_symbol UNIQUE (customer_id, symbol)
);

CREATE TABLE trading.trade_intents (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT trade_intents_pkey PRIMARY KEY (id)
);

CREATE TABLE trading.execution_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    intent_id UUID,
    order_id UUID,
    venue_order_id TEXT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT execution_logs_pkey PRIMARY KEY (id),
    CONSTRAINT execution_logs_intent_id_fkey FOREIGN KEY (intent_id) REFERENCES trading.trade_intents(id) ON DELETE SET NULL,
    CONSTRAINT execution_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES trading.orders(id) ON DELETE SET NULL
);

-- USERS

CREATE TABLE users.users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
);

CREATE TABLE users.user_profiles (
    user_id UUID NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

CREATE TABLE users.user_preferences (
    user_id UUID NOT NULL,
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
);

CREATE TABLE users.roles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

CREATE TABLE users.user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES users.roles(id) ON DELETE CASCADE
);

CREATE TABLE users.audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id UUID,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
    CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE SET NULL
);

-- SQLX MIGRATIONS (for completeness; types normalized)

CREATE TABLE public._sqlx_migrations (
    version BIGINT NOT NULL,
    description TEXT NOT NULL,
    installed_on TIMESTAMPTZ NOT NULL DEFAULT now(),
    success BOOLEAN NOT NULL,
    checksum BYTEA NOT NULL,
    execution_time BIGINT NOT NULL,
    CONSTRAINT _sqlx_migrations_pkey PRIMARY KEY (version)
);

-- WALLET

CREATE TABLE wallet.wallet_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    balance NUMERIC(18,6) NOT NULL DEFAULT 0,
    hold NUMERIC(18,6) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    btc_address TEXT,
    eth_address TEXT,
    crypto_balance_usd DOUBLE PRECISION DEFAULT 0.0,
    CONSTRAINT wallet_accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE wallet.wallet_transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    account_id UUID NOT NULL,
    amount NUMERIC(18,6) NOT NULL,
    tx_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id),
    CONSTRAINT wallet_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES wallet.wallet_accounts(id)
);

CREATE TABLE wallet.idempotency_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT idempotency_keys_pkey PRIMARY KEY (id),
    CONSTRAINT idempotency_keys_key_key UNIQUE (key)
);

CREATE TABLE wallet.fx_rates (
    base_currency TEXT NOT NULL,
    quote_currency TEXT NOT NULL,
    rate DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fx_rates_pkey PRIMARY KEY (base_currency, quote_currency)
);

CREATE TABLE wallet.subaccounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    parent_account_id UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT subaccounts_pkey PRIMARY KEY (id)
);

-- INTELLIGENCE

CREATE TABLE intelligence.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    asset_class TEXT NOT NULL,
    exchange TEXT,
    currency TEXT NOT NULL,
    sector TEXT,
    country TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

CREATE TABLE intelligence.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES intelligence.assets(id),
    ts TIMESTAMP NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    change_abs DOUBLE PRECISION,
    change_pct DOUBLE PRECISION,
    volume DOUBLE PRECISION
);

CREATE TABLE intelligence.news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT,
    source_id TEXT,
    title TEXT,
    body TEXT,
    url TEXT,
    published_at TIMESTAMP,
    summary_ai TEXT,
    sentiment TEXT,
    tags_assets TEXT[],
    tags_themes TEXT[]
);

CREATE TABLE intelligence.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    body_html TEXT NOT NULL,
    author TEXT,
    published_at TIMESTAMP,
    assets TEXT[],
    themes TEXT[]
);

CREATE TABLE intelligence.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE intelligence.quant_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES intelligence.assets(id),
    as_of TIMESTAMP NOT NULL,
    score DOUBLE PRECISION,
    label TEXT,
    explanation TEXT
);


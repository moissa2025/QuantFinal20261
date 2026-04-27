    USE gqx_db;

    -- YOUR FULL SCHEMA BELOW (already correct)
    -- I am NOT modifying your SQL content, only ensuring the DB context is correct.

    CREATE TABLE aml.aml_alerts (
      id UUID NOT NULL,
      user_id UUID NOT NULL,
      alert_type STRING NOT NULL,
      risk_score INT8 NOT NULL,
      description STRING NULL,
      status STRING NOT NULL DEFAULT 'open':::STRING,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
      CONSTRAINT aml_alerts_pkey PRIMARY KEY (id ASC)
    );

    -- (… keep ALL your remaining SQL exactly as-is …)
CREATE TABLE aml.aml_sar_reports (
	id UUID NOT NULL,
	alert_id UUID NOT NULL,
	narrative STRING NOT NULL,
	submitted_at TIMESTAMPTZ NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT aml_sar_reports_pkey PRIMARY KEY (id ASC),
	CONSTRAINT aml_sar_reports_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES aml.aml_alerts(id)
) ;
CREATE TABLE api.request_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id STRING NULL,
	method STRING NOT NULL,
	path STRING NOT NULL,
	status INT8 NOT NULL,
	latency_ms INT8 NOT NULL,
	ip_address STRING NULL,
	user_agent STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT request_log_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE api.rate_limit (
	user_id STRING NOT NULL,
	window_start TIMESTAMPTZ NOT NULL,
	request_count INT8 NOT NULL,
	CONSTRAINT rate_limit_pkey PRIMARY KEY (user_id ASC)
) ;
CREATE TABLE api.api_keys (
	key_id STRING NOT NULL,
	user_id STRING NOT NULL,
	hashed_key STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	last_used TIMESTAMPTZ NULL,
	CONSTRAINT api_keys_pkey PRIMARY KEY (key_id ASC)
) ;
CREATE TABLE auth.users (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	email STRING NOT NULL,
	password_hash STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	disabled BOOL NOT NULL DEFAULT false,
	CONSTRAINT users_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX users_email_key (email ASC)
) ;
CREATE TABLE auth.roles (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX roles_name_key (name ASC)
) ;
CREATE TABLE auth.user_roles (
	user_id UUID NOT NULL,
	role_id UUID NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (user_id ASC, role_id ASC),
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.credentials (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	password_hash STRING NOT NULL,
	password_algo STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT credentials_pkey PRIMARY KEY (id ASC),
	CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.sessions (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	session_token STRING NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ + '01:00:00':::INTERVAL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	revoked BOOL NOT NULL DEFAULT false,
	last_activity_at TIMESTAMPTZ NULL,
	ip STRING NULL,
	device_ua_hash STRING NULL,
	CONSTRAINT sessions_pkey PRIMARY KEY (id ASC),
	CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
	UNIQUE INDEX sessions_session_token_key (session_token ASC)
) ;
CREATE TABLE auth.refresh_tokens (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	token_hash STRING NOT NULL,
	ciphertext BYTES NOT NULL,
	nonce BYTES NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	revoked BOOL NOT NULL DEFAULT false,
	replaced_by UUID NULL,
	CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id ASC),
	CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
	CONSTRAINT refresh_tokens_replaced_by_fkey FOREIGN KEY (replaced_by) REFERENCES auth.refresh_tokens(id)
) ;
CREATE TABLE auth.password_reset_tokens (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	token_hash STRING NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	used BOOL NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id ASC),
	CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.email_verification_tokens (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	token_hash STRING NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	used BOOL NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id ASC),
	CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.login_attempts (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NULL,
	email STRING NULL,
	success BOOL NOT NULL,
	ip_address INET NULL,
	user_agent STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT login_attempts_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE auth.audit_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NULL,
	event_type STRING NOT NULL,
	event_data JSONB NOT NULL,
	ip_address INET NULL,
	user_agent STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT audit_log_pkey PRIMARY KEY (id ASC),
	CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
) ;
CREATE TABLE auth.event_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	event_type STRING NOT NULL,
	payload JSONB NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT event_log_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE auth.user_profile (
	user_id UUID NOT NULL,
	first_name STRING NULL,
	last_name STRING NULL,
	phone_number STRING NULL,
	country STRING NULL,
	timezone STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT user_profile_pkey PRIMARY KEY (user_id ASC),
	CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.user_preferences (
	user_id UUID NOT NULL,
	marketing_opt_in BOOL NOT NULL DEFAULT false,
	dark_mode BOOL NOT NULL DEFAULT false,
	language STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id ASC),
	CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) ;
CREATE TABLE auth.service_accounts (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	description STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT service_accounts_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE auth.api_keys (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	service_account_id UUID NOT NULL,
	key_hash STRING NOT NULL,
	expires_at TIMESTAMPTZ NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	revoked BOOL NOT NULL DEFAULT false,
	CONSTRAINT api_keys_pkey PRIMARY KEY (id ASC),
	CONSTRAINT api_keys_service_account_id_fkey FOREIGN KEY (service_account_id) REFERENCES auth.service_accounts(id) ON DELETE CASCADE
) ;
CREATE TABLE kyc.kyc_records (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	status STRING NOT NULL DEFAULT 'pending':::STRING,
	provider STRING NULL,
	provider_reference STRING NULL,
	risk_score INT8 NULL DEFAULT 0:::INT8,
	rejection_reason STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT kyc_records_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE kyc.kyc_documents (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	kyc_id UUID NOT NULL,
	doc_type STRING NOT NULL,
	file_url STRING NOT NULL,
	status STRING NOT NULL DEFAULT 'uploaded':::STRING,
	rejection_reason STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT kyc_documents_pkey PRIMARY KEY (id ASC),
	CONSTRAINT kyc_documents_kyc_id_fkey FOREIGN KEY (kyc_id) REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
) ;
CREATE TABLE kyc.kyc_audit_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	kyc_id UUID NOT NULL,
	event STRING NOT NULL,
	metadata JSONB NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT kyc_audit_log_pkey PRIMARY KEY (id ASC),
	CONSTRAINT kyc_audit_log_kyc_id_fkey FOREIGN KEY (kyc_id) REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
) ;
CREATE TABLE ledger.accounts (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	code STRING NOT NULL,
	name STRING NOT NULL,
	currency STRING NOT NULL,
	book STRING NOT NULL,
	metadata JSONB NOT NULL DEFAULT '{}':::JSONB,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT accounts_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX accounts_code_key (code ASC),
	INDEX idx_accounts_code (code ASC),
	CONSTRAINT check_book CHECK (book IN ('production':::STRING, 'risk_shadow':::STRING))
) ;
CREATE TABLE ledger.journal (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	txn_type STRING NOT NULL,
	external_ref STRING NULL,
	status STRING NOT NULL DEFAULT 'posted':::STRING,
	reversal_of UUID NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT journal_pkey PRIMARY KEY (id ASC),
	CONSTRAINT journal_reversal_of_fkey FOREIGN KEY (reversal_of) REFERENCES ledger.journal(id),
	INDEX idx_journal_external_ref (external_ref ASC)
) ;
CREATE TABLE ledger.entries (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	journal_id UUID NOT NULL,
	account_id UUID NOT NULL,
	side STRING NOT NULL,
	amount INT8 NOT NULL,
	currency STRING NOT NULL,
	risk_tag STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT entries_pkey PRIMARY KEY (id ASC),
	CONSTRAINT entries_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES ledger.journal(id) ON DELETE CASCADE,
	CONSTRAINT entries_account_id_fkey FOREIGN KEY (account_id) REFERENCES ledger.accounts(id),
	INDEX idx_entries_journal_id (journal_id ASC),
	INDEX idx_entries_account_id (account_id ASC),
	INDEX idx_entries_currency (currency ASC),
	CONSTRAINT check_side CHECK (side IN ('debit':::STRING, 'credit':::STRING))
) ;
CREATE TABLE ledger.account_balances (
	account_id UUID NOT NULL,
	balance INT8 NOT NULL DEFAULT 0:::INT8,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT account_balances_pkey PRIMARY KEY (account_id ASC),
	CONSTRAINT account_balances_account_id_fkey FOREIGN KEY (account_id) REFERENCES ledger.accounts(id)
) ;
CREATE TABLE onboarding.onboarding_sessions (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	status STRING NOT NULL DEFAULT 'pending':::STRING,
	current_step STRING NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT onboarding_sessions_pkey PRIMARY KEY (id ASC),
	INDEX idx_onboarding_sessions_user_id (user_id ASC)
) ;
CREATE TABLE onboarding.onboarding_steps (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	session_id UUID NOT NULL,
	step_name STRING NOT NULL,
	status STRING NOT NULL DEFAULT 'pending':::STRING,
	started_at TIMESTAMPTZ NULL DEFAULT now():::TIMESTAMPTZ,
	completed_at TIMESTAMPTZ NULL,
	error_message STRING NULL,
	CONSTRAINT onboarding_steps_pkey PRIMARY KEY (id ASC),
	CONSTRAINT onboarding_steps_session_id_fkey FOREIGN KEY (session_id) REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE,
	INDEX idx_onboarding_steps_session_id (session_id ASC)
) ;
CREATE TABLE onboarding.onboarding_audit_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	session_id UUID NOT NULL,
	event STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT onboarding_audit_log_pkey PRIMARY KEY (id ASC),
	CONSTRAINT onboarding_audit_log_session_id_fkey FOREIGN KEY (session_id) REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE,
	INDEX idx_onboarding_audit_log_session_id (session_id ASC)
) ;
CREATE TABLE reconciliation.reconciliation_runs (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	run_type STRING NOT NULL,
	status STRING NOT NULL DEFAULT 'pending':::STRING,
	started_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	completed_at TIMESTAMPTZ NULL,
	error_message STRING NULL,
	CONSTRAINT reconciliation_runs_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE reconciliation.reconciliation_items (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	run_id UUID NOT NULL,
	source STRING NOT NULL,
	reference STRING NOT NULL,
	expected_amount DECIMAL NULL,
	actual_amount DECIMAL NULL,
	status STRING NOT NULL DEFAULT 'mismatch':::STRING,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT reconciliation_items_pkey PRIMARY KEY (id ASC),
	CONSTRAINT reconciliation_items_run_id_fkey FOREIGN KEY (run_id) REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
	INDEX idx_recon_items_run_id (run_id ASC)
) ;
CREATE TABLE reconciliation.reconciliation_audit_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	run_id UUID NOT NULL,
	event STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT reconciliation_audit_log_pkey PRIMARY KEY (id ASC),
	CONSTRAINT reconciliation_audit_log_run_id_fkey FOREIGN KEY (run_id) REFERENCES reconciliation.reconciliation_runs(id) ON DELETE CASCADE,
	INDEX idx_recon_audit_run_id (run_id ASC)
) ;
CREATE TABLE risk.risk_limits (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	symbol STRING NULL,
	max_order_size DECIMAL NULL,
	max_notional DECIMAL NULL,
	max_leverage DECIMAL NULL,
	max_daily_loss DECIMAL NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT risk_limits_pkey PRIMARY KEY (id ASC),
	INDEX idx_risk_limits_user_id (user_id ASC),
	INDEX idx_risk_limits_symbol (symbol ASC)
) ;
CREATE TABLE risk.risk_exposures (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	symbol STRING NOT NULL,
	position_size DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	pending_order_size DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	net_exposure DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT risk_exposures_pkey PRIMARY KEY (id ASC),
	INDEX idx_risk_exposures_user_symbol (user_id ASC, symbol ASC)
) ;
CREATE TABLE risk.risk_audit_log (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	symbol STRING NULL,
	side STRING NULL,
	size DECIMAL NULL,
	price DECIMAL NULL,
	allowed BOOL NOT NULL,
	reason STRING NULL,
	exposure_before DECIMAL NULL,
	exposure_after DECIMAL NULL,
	limit_used DECIMAL NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT risk_audit_log_pkey PRIMARY KEY (id ASC),
	INDEX idx_risk_audit_user_id (user_id ASC)
) ;
CREATE TABLE trading.orders (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	customer_id UUID NOT NULL,
	symbol STRING NOT NULL,
	side STRING NOT NULL,
	order_type STRING NOT NULL,
	tif STRING NOT NULL,
	price DECIMAL NULL,
	size DECIMAL NOT NULL,
	status STRING NOT NULL DEFAULT 'NEW':::STRING,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT orders_pkey PRIMARY KEY (id ASC),
	INDEX idx_orders_customer_id (customer_id ASC),
	INDEX idx_orders_symbol (symbol ASC),
	INDEX idx_orders_status (status ASC)
) ;
CREATE TABLE trading.fills (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	order_id UUID NOT NULL,
	maker_order_id UUID NULL,
	taker_order_id UUID NULL,
	symbol STRING NOT NULL,
	price DECIMAL NOT NULL,
	size DECIMAL NOT NULL,
	"role" STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT fills_pkey PRIMARY KEY (id ASC),
	CONSTRAINT fills_order_id_fkey FOREIGN KEY (order_id) REFERENCES trading.orders(id) ON DELETE CASCADE,
	INDEX idx_fills_order_id (order_id ASC),
	INDEX idx_fills_symbol (symbol ASC)
) ;
CREATE TABLE trading.positions (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	customer_id UUID NOT NULL,
	symbol STRING NOT NULL,
	side STRING NOT NULL DEFAULT 'FLAT':::STRING,
	quantity DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	avg_entry_price DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	realised_pnl DECIMAL NOT NULL DEFAULT 0:::DECIMAL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT positions_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX idx_positions_customer_symbol (customer_id ASC, symbol ASC)
) ;
CREATE TABLE trading.trade_intents (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	customer_id UUID NOT NULL,
	strategy_id UUID NULL,
	mandate_id UUID NULL,
	symbol STRING NOT NULL,
	side STRING NOT NULL,
	action STRING NOT NULL,
	quantity DECIMAL NOT NULL,
	order_type STRING NOT NULL,
	limit_price DECIMAL NULL,
	metadata JSONB NULL,
	status STRING NOT NULL DEFAULT 'PENDING':::STRING,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT trade_intents_pkey PRIMARY KEY (id ASC),
	INDEX idx_trade_intents_customer_id (customer_id ASC),
	INDEX idx_trade_intents_status (status ASC)
) ;
CREATE TABLE trading.execution_logs (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	intent_id UUID NULL,
	order_id UUID NULL,
	venue_order_id STRING NULL,
	symbol STRING NOT NULL,
	side STRING NOT NULL,
	status STRING NOT NULL,
	message STRING NULL,
	payload JSONB NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT execution_logs_pkey PRIMARY KEY (id ASC),
	CONSTRAINT execution_logs_intent_id_fkey FOREIGN KEY (intent_id) REFERENCES trading.trade_intents(id) ON DELETE SET NULL,
	CONSTRAINT execution_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES trading.orders(id) ON DELETE SET NULL,
	INDEX idx_execution_logs_order_id (order_id ASC),
	INDEX idx_execution_logs_intent_id (intent_id ASC)
) ;
CREATE TABLE users.users (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	email STRING NOT NULL,
	username STRING NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT users_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX users_email_key (email ASC),
	UNIQUE INDEX users_username_key (username ASC)
) ;
CREATE TABLE users.user_profiles (
	user_id UUID NOT NULL,
	first_name STRING NULL,
	last_name STRING NULL,
	avatar_url STRING NULL,
	bio STRING NULL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id ASC),
	CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
) ;
CREATE TABLE users.user_preferences (
	user_id UUID NOT NULL,
	theme STRING NULL DEFAULT 'light':::STRING,
	language STRING NULL DEFAULT 'en':::STRING,
	timezone STRING NULL DEFAULT 'UTC':::STRING,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id ASC),
	CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE
) ;
CREATE TABLE users.roles (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	name STRING NOT NULL,
	description STRING NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX roles_name_key (name ASC)
) ;
CREATE TABLE users.user_roles (
	user_id UUID NOT NULL,
	role_id UUID NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (user_id ASC, role_id ASC),
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES users.roles(id) ON DELETE CASCADE
) ;
CREATE TABLE users.audit_logs (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	user_id UUID NULL,
	action STRING NOT NULL,
	metadata JSONB NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT audit_logs_pkey PRIMARY KEY (id ASC),
	CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users.users(id) ON DELETE SET NULL
) ;
CREATE TABLE public._sqlx_migrations (
	version INT8 NOT NULL,
	description STRING NOT NULL,
	installed_on TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	success BOOL NOT NULL,
	checksum BYTES NOT NULL,
	execution_time INT8 NOT NULL,
	CONSTRAINT _sqlx_migrations_pkey PRIMARY KEY (version ASC)
) ;
CREATE TABLE wallet.wallet_accounts (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	currency STRING NOT NULL DEFAULT 'USD':::STRING,
	balance DECIMAL(18,6) NOT NULL DEFAULT 0:::DECIMAL,
	hold DECIMAL(18,6) NOT NULL DEFAULT 0:::DECIMAL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	btc_address STRING NULL,
	eth_address STRING NULL,
	crypto_balance_usd FLOAT8 NULL DEFAULT 0.0:::FLOAT8,
	CONSTRAINT wallet_accounts_pkey PRIMARY KEY (id ASC)
) ;
CREATE TABLE wallet.wallet_transactions (
	id INT8 NOT NULL DEFAULT unique_rowid(),
	account_id UUID NOT NULL,
	amount DECIMAL(18,6) NOT NULL,
	tx_type STRING NOT NULL,
	metadata JSONB NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id ASC),
	CONSTRAINT wallet_transactions_account_id_fkey FOREIGN KEY (account_id) REFERENCES wallet.wallet_accounts(id)
) ;
CREATE TABLE wallet.idempotency_keys (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	key STRING NOT NULL,
	request_hash STRING NOT NULL,
	response JSONB NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT idempotency_keys_pkey PRIMARY KEY (id ASC),
	UNIQUE INDEX idempotency_keys_key_key (key ASC)
) ;
CREATE TABLE wallet.fx_rates (
	base_currency STRING NOT NULL,
	quote_currency STRING NOT NULL,
	rate FLOAT8 NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT fx_rates_pkey PRIMARY KEY (base_currency ASC, quote_currency ASC)
) ;
CREATE TABLE wallet.subaccounts (
	id UUID NOT NULL DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL,
	parent_account_id UUID NOT NULL,
	name STRING NOT NULL,
	type STRING NOT NULL,
	balance FLOAT8 NOT NULL DEFAULT 0.0:::FLOAT8,
	currency STRING NOT NULL DEFAULT 'USD':::STRING,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now():::TIMESTAMPTZ,
	CONSTRAINT subaccounts_pkey PRIMARY KEY (id ASC)
) ;
-- Intelligence schema tables
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


-- 1. Add theme_id column if missing
                  ALTER TABLE intelligence.theme_assets
                  ADD COLUMN IF NOT EXISTS theme_id STRING;

                  -- 2. Populate theme_id from theme_slug
                  UPDATE intelligence.theme_assets
                  SET theme_id = theme_slug
                  WHERE theme_id IS NULL;

                  -- 3. Enforce NOT NULL constraint
                  ALTER TABLE intelligence.theme_assets
                  ALTER COLUMN theme_id SET NOT NULL;

   ALTER TABLE intelligence.themes
                  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

                  CREATE TABLE IF NOT EXISTS intelligence.theme_assets (
                      theme_slug STRING NOT NULL REFERENCES intelligence.themes(slug),
                      asset_symbol STRING NOT NULL REFERENCES intelligence.assets(symbol),
                      PRIMARY KEY (theme_slug, asset_symbol)
                  );

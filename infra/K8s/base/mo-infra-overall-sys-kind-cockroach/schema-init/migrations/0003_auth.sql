SET DATABASE = gqx_db;
-- 0003_auth.sql
-- Authentication & Identity domain

SET DATABASE = gqx_db;

-- Users table
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email STRING NOT NULL,
    password_hash STRING NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    disabled BOOL NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    UNIQUE INDEX users_email_key (email)
);

-- Roles table
CREATE TABLE IF NOT EXISTS auth.roles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name STRING NOT NULL,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    UNIQUE INDEX roles_name_key (name)
);

-- User roles (many-to-many)
CREATE TABLE IF NOT EXISTS auth.user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
    CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE
);

-- Credentials table
CREATE TABLE IF NOT EXISTS auth.credentials (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    password_hash STRING NOT NULL,
    password_algo STRING NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT credentials_pkey PRIMARY KEY (id),
    CONSTRAINT credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Sessions
CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_token STRING NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now()::TIMESTAMPTZ + '01:00:00'::INTERVAL),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    revoked BOOL NOT NULL DEFAULT false,
    last_activity_at TIMESTAMPTZ NULL,
    ip STRING NULL,
    device_ua_hash STRING NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE INDEX sessions_session_token_key (session_token)
);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash STRING NOT NULL,
    ciphertext BYTES NOT NULL,
    nonce BYTES NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOL NOT NULL DEFAULT false,
    replaced_by UUID NULL,
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT refresh_tokens_replaced_by_fkey FOREIGN KEY (replaced_by) REFERENCES auth.refresh_tokens(id)
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS auth.password_reset_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash STRING NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOL NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS auth.email_verification_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token_hash STRING NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOL NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Login attempts
CREATE TABLE IF NOT EXISTS auth.login_attempts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    email STRING NULL,
    success BOOL NOT NULL,
    ip_address INET NULL,
    user_agent STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT login_attempts_pkey PRIMARY KEY (id)
);

-- Audit log
CREATE TABLE IF NOT EXISTS auth.audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    event_type STRING NOT NULL,
    event_data JSONB NOT NULL,
    ip_address INET NULL,
    user_agent STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Event log
CREATE TABLE IF NOT EXISTS auth.event_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    event_type STRING NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT event_log_pkey PRIMARY KEY (id)
);

-- User profile
CREATE TABLE IF NOT EXISTS auth.user_profile (
    user_id UUID NOT NULL,
    first_name STRING NULL,
    last_name STRING NULL,
    phone_number STRING NULL,
    country STRING NULL,
    timezone STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT user_profile_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User preferences
CREATE TABLE IF NOT EXISTS auth.user_preferences (
    user_id UUID NOT NULL,
    marketing_opt_in BOOL NOT NULL DEFAULT false,
    dark_mode BOOL NOT NULL DEFAULT false,
    language STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id),
    CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Service accounts
CREATE TABLE IF NOT EXISTS auth.service_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name STRING NOT NULL,
    description STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT service_accounts_pkey PRIMARY KEY (id)
);

-- API keys for service accounts
CREATE TABLE IF NOT EXISTS auth.api_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    service_account_id UUID NOT NULL,
    key_hash STRING NOT NULL,
    expires_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    revoked BOOL NOT NULL DEFAULT false,
    CONSTRAINT api_keys_pkey PRIMARY KEY (id),
    CONSTRAINT api_keys_service_account_id_fkey FOREIGN KEY (service_account_id) REFERENCES auth.service_accounts(id) ON DELETE CASCADE
);


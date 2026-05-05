-- 0012_users.sql
-- Users domain: profiles, settings, activity logs

SET DATABASE = gqx_db;

-- User Profiles
CREATE TABLE IF NOT EXISTS users.user_profiles (
    user_id UUID NOT NULL,
    first_name STRING NULL,
    last_name STRING NULL,
    date_of_birth DATE NULL,
    nationality STRING NULL,
    phone_number STRING NULL,
    address JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id)
);

-- User Settings
CREATE TABLE IF NOT EXISTS users.user_settings (
    user_id UUID NOT NULL,
    language STRING NULL,
    timezone STRING NULL,
    marketing_opt_in BOOL NOT NULL DEFAULT false,
    notifications JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT user_settings_pkey PRIMARY KEY (user_id)
);

-- User Activity Log
CREATE TABLE IF NOT EXISTS users.user_activity_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    event STRING NOT NULL,
    metadata JSONB NULL,
    ip_address STRING NULL,
    user_agent STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT user_activity_log_pkey PRIMARY KEY (id),
    INDEX idx_user_activity_log_user_id (user_id)
);


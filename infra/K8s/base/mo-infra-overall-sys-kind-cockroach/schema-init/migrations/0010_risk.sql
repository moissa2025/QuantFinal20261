-- 0010_risk.sql
-- Risk scoring, exposure, limits, and monitoring domain

SET DATABASE = gqx_db;

-- Risk Profiles
CREATE TABLE IF NOT EXISTS risk.risk_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    risk_score INT8 NOT NULL DEFAULT 0,
    risk_level STRING NOT NULL DEFAULT 'low',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    metadata JSONB NULL,
    CONSTRAINT risk_profiles_pkey PRIMARY KEY (id),
    INDEX idx_risk_profiles_user_id (user_id)
);

-- Risk Limits
CREATE TABLE IF NOT EXISTS risk.risk_limits (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    limit_type STRING NOT NULL,
    limit_value INT8 NOT NULL,
    currency STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT risk_limits_pkey PRIMARY KEY (id),
    INDEX idx_risk_limits_user_id (user_id)
);

-- Risk Breaches
CREATE TABLE IF NOT EXISTS risk.risk_breaches (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    breach_type STRING NOT NULL,
    breach_value INT8 NOT NULL,
    threshold INT8 NOT NULL,
    currency STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ NULL,
    CONSTRAINT risk_breaches_pkey PRIMARY KEY (id),
    INDEX idx_risk_breaches_user_id (user_id)
);

-- Exposure Snapshots
CREATE TABLE IF NOT EXISTS risk.exposure_snapshots (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    exposure_value INT8 NOT NULL,
    currency STRING NOT NULL,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    metadata JSONB NULL,
    CONSTRAINT exposure_snapshots_pkey PRIMARY KEY (id),
    INDEX idx_exposure_snapshots_user_id (user_id)
);

-- Risk Events
CREATE TABLE IF NOT EXISTS risk.risk_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    event_type STRING NOT NULL,
    user_id UUID NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT risk_events_pkey PRIMARY KEY (id),
    INDEX idx_risk_events_user_id (user_id)
);


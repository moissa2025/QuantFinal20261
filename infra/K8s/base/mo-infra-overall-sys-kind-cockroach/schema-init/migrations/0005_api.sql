-- 0005_api.sql
-- API Gateway / Request Logging / Rate Limiting domain

SET DATABASE = gqx_db;

-- Request Log
CREATE TABLE IF NOT EXISTS api.request_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id STRING NULL,
    method STRING NOT NULL,
    path STRING NOT NULL,
    status INT8 NOT NULL,
    latency_ms INT8 NOT NULL,
    ip_address STRING NULL,
    user_agent STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT request_log_pkey PRIMARY KEY (id)
);

-- Rate Limit
CREATE TABLE IF NOT EXISTS api.rate_limit (
    user_id STRING NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    request_count INT8 NOT NULL,
    CONSTRAINT rate_limit_pkey PRIMARY KEY (user_id)
);

-- API Keys
CREATE TABLE IF NOT EXISTS api.api_keys (
    key_id STRING NOT NULL,
    user_id STRING NOT NULL,
    hashed_key STRING NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    last_used TIMESTAMPTZ NULL,
    CONSTRAINT api_keys_pkey PRIMARY KEY (key_id)
);


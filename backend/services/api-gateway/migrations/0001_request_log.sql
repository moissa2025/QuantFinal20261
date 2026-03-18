CREATE SCHEMA IF NOT EXISTS api;

CREATE TABLE IF NOT EXISTS api.request_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    status INT NOT NULL,
    latency_ms INT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


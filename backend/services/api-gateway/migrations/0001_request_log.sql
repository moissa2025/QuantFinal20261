CREATE TABLE IF NOT EXISTS request_log (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    status INT NOT NULL,
    latency_ms INT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


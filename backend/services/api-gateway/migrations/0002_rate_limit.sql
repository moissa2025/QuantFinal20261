CREATE TABLE IF NOT EXISTS api.rate_limit (
    user_id TEXT PRIMARY KEY,
    window_start TIMESTAMPTZ NOT NULL,
    request_count INT NOT NULL
);


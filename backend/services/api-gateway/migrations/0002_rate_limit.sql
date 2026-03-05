CREATE TABLE IF NOT EXISTS rate_limit (
    user_id TEXT PRIMARY KEY,
    window_start TIMESTAMP NOT NULL,
    request_count INT NOT NULL
);


CREATE TABLE IF NOT EXISTS api.api_keys (
    key_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    hashed_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used TIMESTAMPTZ
);


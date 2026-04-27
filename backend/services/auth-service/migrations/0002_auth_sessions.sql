CREATE TABLE IF NOT EXISTS auth.sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    session_token TEXT NOT NULL,
    ip TEXT,
    device_ua_hash TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT false
);


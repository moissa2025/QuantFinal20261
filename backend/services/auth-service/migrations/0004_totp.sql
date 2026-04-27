CREATE TABLE IF NOT EXISTS auth.totp (
    user_id UUID PRIMARY KEY,
    secret TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT false
);


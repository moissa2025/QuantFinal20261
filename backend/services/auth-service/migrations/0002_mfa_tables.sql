CREATE TABLE auth.email_otp (
    user_id UUID PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE auth.totp (
    user_id UUID PRIMARY KEY,
    secret TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT false
);


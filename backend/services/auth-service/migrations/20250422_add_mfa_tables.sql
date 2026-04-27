-- Activation tokens
CREATE TABLE IF NOT EXISTS auth.activation_tokens (
    user_id UUID PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Email OTP
CREATE TABLE IF NOT EXISTS auth.email_otp (
    user_id UUID NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id)
);

-- TOTP secrets
CREATE TABLE IF NOT EXISTS auth.totp (
    user_id UUID PRIMARY KEY,
    secret TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT false
);


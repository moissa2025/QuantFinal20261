CREATE TABLE IF NOT EXISTS auth.email_otp (
    user_id UUID PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);


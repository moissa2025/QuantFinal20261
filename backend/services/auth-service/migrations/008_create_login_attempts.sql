-- Tracks login attempts for rate limiting, fraud detection, and lockouts
CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    email TEXT,
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_attempts_user_id_idx
    ON login_attempts(user_id);

CREATE INDEX IF NOT EXISTS login_attempts_email_idx
    ON login_attempts(email);


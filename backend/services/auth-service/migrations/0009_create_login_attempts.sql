CREATE TABLE login_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    email TEXT,
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


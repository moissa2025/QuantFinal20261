CREATE SCHEMA IF NOT EXISTS onboarding;

CREATE TABLE onboarding.onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    current_step TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_onboarding_sessions_user_id
    ON onboarding.onboarding_sessions(user_id);


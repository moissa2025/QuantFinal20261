-- 0008_onboarding.sql
-- User onboarding workflow domain

SET DATABASE = gqx_db;

-- Onboarding Sessions
CREATE TABLE IF NOT EXISTS onboarding.onboarding_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status STRING NOT NULL DEFAULT 'pending',
    current_step STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT onboarding_sessions_pkey PRIMARY KEY (id),
    INDEX idx_onboarding_sessions_user_id (user_id)
);

-- Onboarding Steps
CREATE TABLE IF NOT EXISTS onboarding.onboarding_steps (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    step_name STRING NOT NULL,
    status STRING NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ NULL DEFAULT now()::TIMESTAMPTZ,
    completed_at TIMESTAMPTZ NULL,
    error_message STRING NULL,
    CONSTRAINT onboarding_steps_pkey PRIMARY KEY (id),
    CONSTRAINT onboarding_steps_session_id_fkey FOREIGN KEY (session_id)
        REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE,
    INDEX idx_onboarding_steps_session_id (session_id)
);

-- Onboarding Audit Log
CREATE TABLE IF NOT EXISTS onboarding.onboarding_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    event STRING NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT onboarding_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT onboarding_audit_log_session_id_fkey FOREIGN KEY (session_id)
        REFERENCES onboarding.onboarding_sessions(id) ON DELETE CASCADE,
    INDEX idx_onboarding_audit_log_session_id (session_id)
);


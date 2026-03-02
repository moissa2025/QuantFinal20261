-- Audit log for compliance, traceability, and institutional-grade observability
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_type TEXT NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_log_user_id_idx
    ON audit_log(user_id);

CREATE INDEX IF NOT EXISTS audit_log_event_type_idx
    ON audit_log(event_type);


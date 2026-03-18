CREATE TABLE aml.aml_alerts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    alert_type TEXT NOT NULL,
    risk_score INT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aml.aml_sar_reports (
    id UUID PRIMARY KEY,
    alert_id UUID NOT NULL REFERENCES aml.aml_alerts(id),
    narrative TEXT NOT NULL,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


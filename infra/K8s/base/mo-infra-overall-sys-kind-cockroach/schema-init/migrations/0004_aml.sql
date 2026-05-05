-- 0004_aml.sql
-- Anti-Money Laundering (AML) domain

SET DATABASE = gqx_db;

-- AML Alerts
CREATE TABLE IF NOT EXISTS aml.aml_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    alert_type STRING NOT NULL,
    risk_score INT8 NOT NULL,
    description STRING NULL,
    status STRING NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT aml_alerts_pkey PRIMARY KEY (id)
);

-- SAR Reports
CREATE TABLE IF NOT EXISTS aml.aml_sar_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL,
    narrative STRING NOT NULL,
    submitted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT aml_sar_reports_pkey PRIMARY KEY (id),
    CONSTRAINT aml_sar_reports_alert_id_fkey FOREIGN KEY (alert_id)
        REFERENCES aml.aml_alerts(id)
);




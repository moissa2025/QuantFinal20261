-- 0014_intelligence.sql
-- Intelligence domain: analytics, ML outputs, feature snapshots, anomaly detection

SET DATABASE = gqx_db;

-- Analytics Events
CREATE TABLE IF NOT EXISTS intelligence.analytics_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    event_type STRING NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT analytics_events_pkey PRIMARY KEY (id),
    INDEX idx_analytics_events_user_id (user_id)
);

-- Model Outputs
CREATE TABLE IF NOT EXISTS intelligence.model_outputs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    model_name STRING NOT NULL,
    version STRING NOT NULL,
    user_id UUID NULL,
    output JSONB NOT NULL,
    score DECIMAL NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT model_outputs_pkey PRIMARY KEY (id),
    INDEX idx_model_outputs_user_id (user_id)
);

-- Feature Snapshots
CREATE TABLE IF NOT EXISTS intelligence.feature_snapshots (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    feature_set STRING NOT NULL,
    features JSONB NOT NULL,
    snapshot_time TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT feature_snapshots_pkey PRIMARY KEY (id),
    INDEX idx_feature_snapshots_user_id (user_id)
);

-- Anomaly Detections
CREATE TABLE IF NOT EXISTS intelligence.anomaly_detections (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    anomaly_type STRING NOT NULL,
    score DECIMAL NOT NULL,
    metadata JSONB NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT anomaly_detections_pkey PRIMARY KEY (id),
    INDEX idx_anomaly_detections_user_id (user_id)
);


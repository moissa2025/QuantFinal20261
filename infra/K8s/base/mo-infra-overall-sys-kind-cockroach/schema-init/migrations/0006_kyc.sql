-- 0006_kyc.sql
-- Know Your Customer (KYC) domain

SET DATABASE = gqx_db;

-- KYC Records
CREATE TABLE IF NOT EXISTS kyc.kyc_records (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status STRING NOT NULL DEFAULT 'pending',
    provider STRING NULL,
    provider_reference STRING NULL,
    risk_score INT8 NULL DEFAULT 0,
    rejection_reason STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT kyc_records_pkey PRIMARY KEY (id)
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc.kyc_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL,
    doc_type STRING NOT NULL,
    file_url STRING NOT NULL,
    status STRING NOT NULL DEFAULT 'uploaded',
    rejection_reason STRING NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT kyc_documents_pkey PRIMARY KEY (id),
    CONSTRAINT kyc_documents_kyc_id_fkey FOREIGN KEY (kyc_id)
        REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
);

-- KYC Audit Log
CREATE TABLE IF NOT EXISTS kyc.kyc_audit_log (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL,
    event STRING NOT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()::TIMESTAMPTZ,
    CONSTRAINT kyc_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT kyc_audit_log_kyc_id_fkey FOREIGN KEY (kyc_id)
        REFERENCES kyc.kyc_records(id) ON DELETE CASCADE
);


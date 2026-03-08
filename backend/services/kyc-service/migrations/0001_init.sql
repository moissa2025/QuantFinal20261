-- KYC Records
CREATE TABLE IF NOT EXISTS kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',   -- pending | approved | rejected | manual_review
    provider TEXT,
    provider_reference TEXT,
    risk_score INTEGER DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL REFERENCES kyc_records(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploaded',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KYC Audit Log
CREATE TABLE IF NOT EXISTS kyc_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kyc_id UUID NOT NULL REFERENCES kyc_records(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


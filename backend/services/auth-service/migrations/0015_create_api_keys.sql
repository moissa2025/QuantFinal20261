CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    service_account_id UUID NOT NULL REFERENCES service_accounts(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);


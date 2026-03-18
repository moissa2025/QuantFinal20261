CREATE TABLE auth.refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    token_hash TEXT NOT NULL,
    ciphertext BYTES NOT NULL,
    nonce BYTES NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    replaced_by UUID REFERENCES auth.refresh_tokens(id)
);


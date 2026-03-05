CREATE TABLE account_balances (
    account_id  UUID PRIMARY KEY REFERENCES accounts(id),
    balance     BIGINT NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE TABLE ledger.account_balances (
    account_id  UUID PRIMARY KEY REFERENCES ledger.accounts(id),
    balance     BIGINT NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


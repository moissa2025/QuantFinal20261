CREATE INDEX idx_entries_journal_id ON ledger.entries(journal_id);
CREATE INDEX idx_entries_account_id ON ledger.entries(account_id);
CREATE INDEX idx_entries_currency ON ledger.entries(currency);

CREATE INDEX idx_journal_external_ref ON ledger.journal(external_ref);

CREATE INDEX idx_accounts_code ON ledger.accounts(code);


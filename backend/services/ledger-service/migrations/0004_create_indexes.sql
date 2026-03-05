CREATE INDEX idx_entries_journal_id ON entries(journal_id);
CREATE INDEX idx_entries_account_id ON entries(account_id);
CREATE INDEX idx_entries_currency ON entries(currency);

CREATE INDEX idx_journal_external_ref ON journal(external_ref);

CREATE INDEX idx_accounts_code ON accounts(code);


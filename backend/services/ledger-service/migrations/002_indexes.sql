-- ACCOUNTS
CREATE INDEX idx_accounts_user ON accounts(user_id);

-- ENTRIES
CREATE INDEX idx_entries_account ON entries(account_id);
CREATE INDEX idx_entries_journal ON entries(journal_id);
CREATE INDEX idx_entries_currency ON entries(currency);

-- JOURNALS
CREATE INDEX idx_journals_reference ON journals(reference_id);

-- AUDIT LOGS
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);


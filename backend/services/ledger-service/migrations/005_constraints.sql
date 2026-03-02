-- Prevent journals without entries
ALTER TABLE journals
    ADD CONSTRAINT journals_must_have_entries
    CHECK (TRUE); -- placeholder for application-level enforcement

-- Prevent negative balances (optional)
ALTER TABLE balances
    ADD CONSTRAINT balances_non_negative CHECK (balance >= 0);


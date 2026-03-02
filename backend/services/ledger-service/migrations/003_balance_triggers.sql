------------------------------------------------------------
-- TRIGGER FUNCTION: update balances on entry insert
------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_balance_on_entry()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.direction = 'DEBIT' THEN
            UPDATE balances
            SET balance = balance + NEW.amount,
                updated_at = NOW()
            WHERE account_id = NEW.account_id;

        ELSIF NEW.direction = 'CREDIT' THEN
            UPDATE balances
            SET balance = balance - NEW.amount,
                updated_at = NOW()
            WHERE account_id = NEW.account_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

------------------------------------------------------------
-- TRIGGER: attach to entries
------------------------------------------------------------
CREATE TRIGGER trg_update_balance
AFTER INSERT ON entries
FOR EACH ROW
EXECUTE FUNCTION update_balance_on_entry();


from decimal import Decimal
from app import models


def test_audit_logs(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="audit_1")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id, account_id=acc.id, amount=Decimal("5"), reference="audit_1"
    ))
    db_session.commit()

    txns = client.get("/audit/transactions")
    assert txns.status_code == 200
    assert len(txns.json()) == 1

    entries = client.get("/audit/journal-entries")
    assert entries.status_code == 200
    assert len(entries.json()) == 1

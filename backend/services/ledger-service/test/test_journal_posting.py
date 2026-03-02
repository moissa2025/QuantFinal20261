from decimal import Decimal
from app import models


def test_simple_journal_posting(db_session, create_account):
    acc = create_account("Test Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="simple_1")
    db_session.add(txn)
    db_session.flush()

    debit = models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("100.00"),
        reference="simple_1",
        meta={"leg": "debit"},
    )

    credit = models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("-100.00"),
        reference="simple_1",
        meta={"leg": "credit"},
    )

    db_session.add(debit)
    db_session.add(credit)
    db_session.commit()

    entries = (
        db_session.query(models.JournalEntry)
        .filter(models.JournalEntry.transaction_id == txn.id)
        .all()
    )

    assert len(entries) == 2
    assert sum(e.amount for e in entries) == Decimal("0")


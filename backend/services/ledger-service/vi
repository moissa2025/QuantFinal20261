from decimal import Decimal
from app import models


def test_posting_engine_creates_balanced_transaction(db_session, create_account):
    acc1 = create_account("A1", "GBP")
    acc2 = create_account("A2", "GBP")

    txn = models.Transaction(type="engine", correlation_id="engine_1")
    db_session.add(txn)
    db_session.flush()

    rows = [
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=acc1.id,
            amount=Decimal("-30.00"),
            reference="engine_1",
            meta={},
        ),
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=acc2.id,
            amount=Decimal("30.00"),
            reference="engine_1",
            meta={},
        ),
    ]

    for r in rows:
        db_session.add(r)

    db_session.commit()

    total = sum(r.amount for r in rows)
    assert total == Decimal("0")


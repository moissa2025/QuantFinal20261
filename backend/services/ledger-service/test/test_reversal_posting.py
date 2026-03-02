from decimal import Decimal
from app import models


def test_reversal_posting(db_session, create_account):
    acc = create_account("Wallet", "GBP")

    # Original transaction
    txn = models.Transaction(type="simple", correlation_id="rev_1")
    db_session.add(txn)
    db_session.flush()

    original = models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("75.00"),
        reference="rev_1",
        meta={},
    )
    db_session.add(original)
    db_session.commit()

    # Reversal transaction
    rev_txn = models.Transaction(type="reversal", correlation_id="rev_1_r")
    db_session.add(rev_txn)
    db_session.flush()

    reversal = models.JournalEntry(
        transaction_id=rev_txn.id,
        account_id=acc.id,
        amount=Decimal("-75.00"),
        reference="rev_1_r",
        meta={"reversal": True},
    )
    db_session.add(reversal)
    db_session.commit()

    total = (
        db_session.query(models.JournalEntry)
        .filter(models.JournalEntry.account_id == acc.id)
        .with_entities(models.JournalEntry.amount)
        .all()
    )

    assert sum(t[0] for t in total) == Decimal("0")


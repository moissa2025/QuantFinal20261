import time
from decimal import Decimal
from app import models

def test_posting_throughput(db_session, create_account):
    acc = create_account("Perf", "GBP")

    start = time.time()
    for i in range(1_000):
        txn = models.Transaction(type="simple", correlation_id=f"perf_{i}")
        db_session.add(txn)
        db_session.flush()
        db_session.add(models.JournalEntry(
            transaction_id=txn.id,
            account_id=acc.id,
            amount=Decimal("1"),
            reference=f"perf_{i}",
        ))
    db_session.commit()
    elapsed = time.time() - start

    assert elapsed < 2.0  # tune threshold


from decimal import Decimal
from app import models


def test_trial_balance_across_ledger(db_session, create_account):
    acc1 = create_account("A1", "GBP")
    acc2 = create_account("A2", "GBP")

    # Transaction 1
    txn1 = models.Transaction(type="simple", correlation_id="tb_1")
    db_session.add(txn1)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn1.id,
        account_id=acc1.id,
        amount=Decimal("100.00"),
        reference="tb_1",
        meta={}
    ))
    db_session.add(models.JournalEntry(
        transaction_id=txn1.id,
        account_id=acc2.id,
        amount=Decimal("-100.00"),
        reference="tb_1",
        meta={}
    ))

    # Transaction 2
    txn2 = models.Transaction(type="simple", correlation_id="tb_2")
    db_session.add(txn2)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn2.id,
        account_id=acc1.id,
        amount=Decimal("-40.00"),
        reference="tb_2",
        meta={}
    ))
    db_session.add(models.JournalEntry(
        transaction_id=txn2.id,
        account_id=acc2.id,
        amount=Decimal("40.00"),
        reference="tb_2",
        meta={}
    ))

    db_session.commit()

    # Trial balance: sum of all entries must be zero
    total = sum(
        e.amount
        for e in db_session.query(models.JournalEntry).all()
    )

    assert total == Decimal("0")


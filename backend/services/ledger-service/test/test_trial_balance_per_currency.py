from decimal import Decimal
from app import models


def test_trial_balance_per_currency(client, db_session, create_account):
    acc1 = create_account("A1", "GBP")
    acc2 = create_account("A2", "USD")

    # GBP +100 -100 = 0
    txn1 = models.Transaction(type="simple", correlation_id="tbpc_1")
    db_session.add(txn1)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn1.id, account_id=acc1.id, amount=Decimal("100"), reference="tbpc_1"
    ))
    db_session.add(models.JournalEntry(
        transaction_id=txn1.id, account_id=acc1.id, amount=Decimal("-100"), reference="tbpc_1"
    ))

    # USD +50 -50 = 0
    txn2 = models.Transaction(type="simple", correlation_id="tbpc_2")
    db_session.add(txn2)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn2.id, account_id=acc2.id, amount=Decimal("50"), reference="tbpc_2"
    ))
    db_session.add(models.JournalEntry(
        transaction_id=txn2.id, account_id=acc2.id, amount=Decimal("-50"), reference="tbpc_2"
    ))

    db_session.commit()

    response = client.get("/trial-balance/per-currency")
    assert response.status_code == 200

    data = response.json()["per_currency"]
    assert data["GBP"] == "0"
    assert data["USD"] == "0"

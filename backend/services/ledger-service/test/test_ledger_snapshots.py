from decimal import Decimal
from app import models


def test_ledger_snapshot(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="snap_1")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id, account_id=acc.id, amount=Decimal("30"), reference="snap_1"
    ))
    db_session.commit()

    response = client.get("/snapshots/ledger")
    assert response.status_code == 200

    balances = response.json()["balances"]
    assert list(balances.values())[0] == "30"

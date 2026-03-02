from decimal import Decimal
from app import models
def test_account_statement(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="stmt_1")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id,
        account_id=acc.id,
        amount=Decimal("25"),
        reference="stmt_1"
    ))
    db_session.commit()

    response = client.get(f"/accounts/{acc.id}/statement")
    assert response.status_code == 200

    items = response.json()
    assert len(items) == 1

    # Option A: accept numeric values
    assert float(items[0]["amount"]) == 25.0

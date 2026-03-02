from fastapi.testclient import TestClient
from decimal import Decimal
from app import models


def test_cursor_pagination_prod(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")

    # Create 5 transactions with entries
    for i in range(5):
        txn = models.Transaction(type="simple", correlation_id=f"cursor_{i}")
        db_session.add(txn)
        db_session.flush()

        db_session.add(
            models.JournalEntry(
                transaction_id=txn.id,
                account_id=acc.id,
                amount=Decimal("1.00"),
                reference=f"cursor_{i}",
                meta={},
            )
        )

    db_session.commit()

    # Call your API endpoint for pagination
    response = client.get("/journal?limit=2")
    assert response.status_code == 200

    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 2
    assert "next_cursor" in data

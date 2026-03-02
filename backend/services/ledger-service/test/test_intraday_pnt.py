from datetime import date
from decimal import Decimal

from app import models


def test_intraday_pnl(client, db_session, create_account):
    # Create an account
    acc = create_account("Wallet", "GBP")

    # Create a transaction
    txn = models.Transaction(type="simple", correlation_id="pnl_1")
    db_session.add(txn)
    db_session.flush()

    # Add a journal entry for today
    db_session.add(
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=acc.id,
            amount=Decimal("12"),
            reference="pnl_1",
        )
    )
    db_session.commit()

    # Call the endpoint
    today = str(date.today())
    response = client.get(f"/pnl/intraday?for_date={today}")

    assert response.status_code == 200

    data = response.json()

    # Validate structure
    assert "date" in data
    assert "pnl" in data

    # PnL should be returned as a normalised string
    assert data["pnl"] == "12"


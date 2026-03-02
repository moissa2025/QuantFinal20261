from datetime import date
from decimal import Decimal
from app import models


def test_regulatory_daily_summary(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="reg_1")
    db_session.add(txn)
    db_session.flush()

    db_session.add(models.JournalEntry(
        transaction_id=txn.id, account_id=acc.id, amount=Decimal("7"), reference="reg_1"
    ))
    db_session.commit()

    today = str(date.today())
    response = client.get(f"/regulatory/daily-summary?for_date={today}")
    assert response.status_code == 200

    data = response.json()
    assert data["transaction_count"] == 1
    assert data["total_volume"] == "7"


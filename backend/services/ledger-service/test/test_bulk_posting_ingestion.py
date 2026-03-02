from decimal import Decimal
from app import models

def test_bulk_posting_ingestion(client, db_session, create_account):
    acc = create_account("Wallet", "GBP")
    db_session.commit()  # ← REQUIRED

    payload = {
        "lines": [
            {"transaction_ref": "bulk_1", "account_id": str(acc.id), "amount": "10"},
            {"transaction_ref": "bulk_1", "account_id": str(acc.id), "amount": "-10"},
        ]
    }

    response = client.post("/bulk-postings", json=payload)
    assert response.status_code == 200

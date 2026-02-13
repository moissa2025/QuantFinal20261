from datetime import datetime, timedelta, UTC
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
import uuid

def create_account(name: str):
    payload = {
        "name": name,
        "type": "asset",
        "currency": "GBP",
        "user_id": str(uuid.uuid4())   # REQUIRED
    }
    response = client.post("/accounts/", json=payload)
    assert response.status_code == 200, response.text
    return response.json()["id"]

def create_entry(account_id: str, amount: float, meta=None):
    payload = {
        "account_id": account_id,
        "amount": amount,
        "meta": meta or {}
    }
    response = client.post("/entries/", json=payload)
    assert response.status_code == 200, response.text
    return response.json()


def test_cursor_first_page():
    account_id = create_account("Test Account Pagination")

    for i in range(15):
        create_entry(account_id, amount=100 + i)

    response = client.get(f"/statements/{account_id}?limit=10")
    assert response.status_code == 200, response.text

    data = response.json()
    assert len(data["entries"]) == 10
    assert data["next_cursor"] is not None


def test_cursor_second_page():
    account_id = create_account("Test Account Pagination 2")

    for i in range(15):
        create_entry(account_id, amount=200 + i)

    first = client.get(f"/statements/{account_id}?limit=10")
    assert first.status_code == 200
    cursor = first.json()["next_cursor"]

    second = client.get(f"/statements/{account_id}?limit=10&cursor={cursor}")
    assert second.status_code == 200

    data = second.json()
    assert len(data["entries"]) >= 1
    assert "next_cursor" in data


def test_cursor_full_pagination():
    account_id = create_account("Test Account Pagination 3")

    for i in range(25):
        create_entry(account_id, amount=300 + i)

    items = []
    cursor = None

    while True:
        url = f"/statements/{account_id}?limit=10"
        if cursor:
            url += f"&cursor={cursor}"

        response = client.get(url)
        assert response.status_code == 200

        page = response.json()
        items.extend(page["entries"])

        cursor = page["next_cursor"]
        if cursor is None:
            break

    assert len(items) >= 25


def test_cursor_respects_from_date():
    account_id = create_account("Test Account Pagination 4")

    for i in range(10):
        create_entry(account_id, amount=400 + i)

    from_date = datetime.now(UTC).isoformat()

    create_entry(account_id, amount=999)

    response = client.get(
        f"/statements/{account_id}?limit=50&from_date={from_date}"
    )
    assert response.status_code == 200

    data = response.json()
    for e in data["entries"]:
        assert e["created_at"] >= from_date


def test_cursor_respects_to_date():
    account_id = create_account("Test Account Pagination 5")

    for i in range(10):
        create_entry(account_id, amount=500 + i)

    to_date = datetime.now(UTC).isoformat()

    create_entry(account_id, amount=999)

    response = client.get(
        f"/statements/{account_id}?limit=50&to_date={to_date}"
    )
    assert response.status_code == 200

    data = response.json()
    for e in data["entries"]:
        assert e["created_at"] <= to_date


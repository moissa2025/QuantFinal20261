import pytest
from uuid import UUID
@pytest.fixture
def seeded_account(db):
    from app import models
    from uuid import uuid4
    from datetime import datetime

    account_id = uuid4()

    account = models.Account(
        id=account_id,
        name="Test Account",
        type="asset",
        user_id=uuid4(),
        currency="USD",
        created_at=datetime(2026, 2, 8, 17, 20, 0)
    )
    db.add(account)

    # Insert 4 deterministic entries
    entries = [
        models.JournalEntry(
            id=uuid4(),
            account_id=account_id,
            amount=100,
            created_at=datetime(2026, 2, 8, 17, 25, 0)
        ),
        models.JournalEntry(
            id=uuid4(),
            account_id=account_id,
            amount=300,
            created_at=datetime(2026, 2, 8, 17, 26, 0)
        ),
        models.JournalEntry(
            id=uuid4(),
            account_id=account_id,
            amount=200,
            created_at=datetime(2026, 2, 8, 17, 27, 0)
        ),
        models.JournalEntry(
            id=uuid4(),
            account_id=account_id,
            amount=400,
            created_at=datetime(2026, 2, 8, 17, 28, 0)
        ),
    ]

    db.add_all(entries)
    db.commit()

    return account_id
def test_cursor_first_page(client, seeded_account):
    account_id = seeded_account

    # First page: limit=2
    r = client.get(f"/statements/{account_id}?limit=2")
    assert r.status_code == 200

    data = r.json()
    entries = data["entries"]

    # Should return exactly 2 entries
    assert len(entries) == 2

    # next_cursor must be the last entry_id
    assert data["next_cursor"] == entries[-1]["entry_id"]

    # Opening balance must be correct for full window
    assert data["opening_balance"] == "0"


def test_cursor_second_page(client, seeded_account):
    account_id = seeded_account

    # First page
    r1 = client.get(f"/statements/{account_id}?limit=2")
    cursor = r1.json()["next_cursor"]

    # Second page
    r2 = client.get(f"/statements/{account_id}?limit=2&cursor={cursor}")
    assert r2.status_code == 200

    data2 = r2.json()
    entries2 = data2["entries"]

    # Should return next 2 entries
    assert len(entries2) == 2

    # Ensure no overlap with first page
    first_page_ids = {e["entry_id"] for e in r1.json()["entries"]}
    second_page_ids = {e["entry_id"] for e in entries2}
    assert first_page_ids.isdisjoint(second_page_ids)

    # next_cursor must be last entry_id of page 2
    assert data2["next_cursor"] == entries2[-1]["entry_id"]


def test_cursor_full_pagination(client, seeded_account):
    account_id = seeded_account

    seen = set()
    cursor = None

    while True:
        url = f"/statements/{account_id}?limit=2"
        if cursor:
            url += f"&cursor={cursor}"

        r = client.get(url)
        assert r.status_code == 200

        data = r.json()
        entries = data["entries"]

        # No duplicates
        for e in entries:
            assert e["entry_id"] not in seen
            seen.add(e["entry_id"])

        cursor = data["next_cursor"]
        if cursor is None:
            break

    # Ensure we saw all entries in the account
    r_full = client.get(f"/statements/{account_id}")
    full_ids = {e["entry_id"] for e in r_full.json()["entries"]}

    assert seen == full_ids


def test_cursor_respects_from_date(client, seeded_account):
    account_id = seeded_account

    # Pick a from_date that excludes the first entry
    from_date = "2026-02-08T17:26:00"

    r = client.get(f"/statements/{account_id}?limit=2&from_date={from_date}")
    assert r.status_code == 200

    data = r.json()
    entries = data["entries"]

    # Opening balance must be correct for this window
    assert data["opening_balance"] == "100.00000000"

    # All entries must be >= from_date
    for e in entries:
        assert e["created_at"] >= from_date


def test_cursor_respects_to_date(client, seeded_account):
    account_id = seeded_account

    to_date = "2026-02-08T17:40:00"

    r = client.get(f"/statements/{account_id}?limit=2&to_date={to_date}")
    assert r.status_code == 200

    data = r.json()
    entries = data["entries"]

    # All entries must be <= to_date
    for e in entries:
        assert e["created_at"] <= to_date

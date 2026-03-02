from decimal import Decimal
from sqlalchemy.orm import Session
from app import models
from app.schemas.fx import FxPostingCreate

from app.services.fx_posting import post_fx_journal


def _account_balance(db: Session, account_id):
    total = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.account_id == account_id)
        .with_entities(models.JournalEntry.amount)
        .all()
    )
    return sum(a[0] for a in total) if total else Decimal("0")


def test_account_balance_after_simple_postings(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")

    txn = models.Transaction(type="simple", correlation_id="bal_simple_1")
    db_session.add(txn)
    db_session.flush()

    # Debit +100
    db_session.add(
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=gbp.id,
            amount=Decimal("100.00"),
            reference="bal_simple_1",
            meta={"leg": "debit"},
        )
    )

    # Credit -40
    db_session.add(
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=gbp.id,
            amount=Decimal("-40.00"),
            reference="bal_simple_1",
            meta={"leg": "credit"},
        )
    )

    db_session.commit()

    balance = _account_balance(db_session, gbp.id)
    assert balance == Decimal("60.00")


def test_account_balance_after_fx_posting(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")
    usd = create_account("USD Wallet", "USD")
    payload = FxPostingCreate(
        reference="bal_fx_1",
        from_account_id=gbp.id,
        to_account_id=usd.id,
        from_amount=Decimal("100"),
        to_amount=Decimal("120"),
        rate=Decimal("1.20"),
        meta={},
    )

    result = post_fx_journal(db_session, payload)

    gbp_balance = _account_balance(db_session, gbp.id)
    usd_balance = _account_balance(db_session, usd.id)

    assert gbp_balance == Decimal("-100.00")
    assert usd_balance == Decimal("120.00")

    assert result.reference == "bal_fx_1"
    assert len(result.lines) >= 2

from decimal import Decimal
from app import models
from app.schemas.fx import FxPostingCreate
from app.schemas.posting import JournalEntryOut
from app.services.fx_posting import post_fx_journal


def test_fx_reversal(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")
    usd = create_account("USD Wallet", "USD")

    # Original FX posting
    payload = FxPostingCreate(
        reference="fx_rev_1",
        from_account_id=gbp.id,
        to_account_id=usd.id,
        from_amount=Decimal("100"),
        to_amount=Decimal("120"),
        rate=Decimal("1.20"),
        meta={},
    )

    post_fx_journal(db_session, payload)

    # Reverse FX posting
    reversal_payload = FxPostingCreate(
        reference="fx_rev_1_r",
        from_account_id=usd.id,
        to_account_id=gbp.id,
        from_amount=Decimal("120"),
        to_amount=Decimal("100"),
        rate=Decimal("0.833333"),
        meta={"reversal": True},
    )

    post_fx_journal(db_session, reversal_payload)

    # Check balances return to zero
    gbp_total = sum(
        e.amount for e in db_session.query(models.JournalEntry)
        .filter(models.JournalEntry.account_id == gbp.id)
    )
    usd_total = sum(
        e.amount for e in db_session.query(models.JournalEntry)
        .filter(models.JournalEntry.account_id == usd.id)
    )

    assert gbp_total == Decimal("0")
    assert usd_total == Decimal("0")

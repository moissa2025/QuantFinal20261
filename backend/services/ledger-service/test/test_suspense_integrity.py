from decimal import Decimal
from app import models
from app.services.fx_posting import post_fx_journal
from app.schemas.fx import FxPostingCreate
from app.schemas.posting import JournalEntryOut, JournalLine


def test_suspense_account_integrity(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")
    usd = create_account("USD Wallet", "USD")

    # Create an intentionally unbalanced FX posting
    payload = FxPostingCreate(
        reference="suspense_1",
        from_account_id=gbp.id,
        to_account_id=usd.id,
        from_amount=Decimal("100"),
        to_amount=Decimal("119"),  # imbalance of 1
        rate=Decimal("1.19"),
        meta={},
    )

    result = post_fx_journal(db_session, payload)

    # Suspense must exist
    suspense_entries = [
        line for line in result.lines
        if line.meta.get("fx_suspense") is True
    ]

    assert len(suspense_entries) == 1

    # Entire transaction must still balance to zero
    total = sum(line.amount for line in result.lines)
    assert total == Decimal("0")

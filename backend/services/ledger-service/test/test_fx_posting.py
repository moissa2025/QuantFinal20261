from decimal import Decimal
from app.services.fx_posting import post_fx_journal
from app.schemas.fx import FxPostingCreate
from app.schemas.posting import JournalEntryOut


def test_fx_posting_creates_balanced_journal(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")
    usd = create_account("USD Wallet", "USD")

    payload = FxPostingCreate(
        reference="fx_test_1",
        from_account_id=gbp.id,
        to_account_id=usd.id,
        from_amount=Decimal("50"),
        to_amount=Decimal("60"),
        rate=Decimal("1.20"),
        meta={},
    )

    result = post_fx_journal(db_session, payload)

    assert result.reference == "fx_test_1"
    assert len(result.lines) >= 2

    total = sum([line.amount for line in result.lines])
    assert total == Decimal("0")

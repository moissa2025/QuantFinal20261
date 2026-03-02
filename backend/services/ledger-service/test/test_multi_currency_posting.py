from decimal import Decimal
from app import models
from app.schemas.fx import FxPostingCreate
from app.services.fx_posting import post_fx_journal

def test_multi_currency_posting(db_session, create_account):
    gbp = create_account("GBP Wallet", "GBP")
    usd = create_account("USD Wallet", "USD")
    eur = create_account("EUR Wallet", "EUR")

    # GBP → USD
    post_fx_journal(db_session, FxPostingCreate(
        reference="multi_1",
        from_account_id=gbp.id,
        to_account_id=usd.id,
        from_amount=Decimal("100"),
        to_amount=Decimal("120"),
        rate=Decimal("1.20"),
        meta={},
    ))

    # USD → EUR
    post_fx_journal(db_session, FxPostingCreate(
        reference="multi_2",
        from_account_id=usd.id,
        to_account_id=eur.id,
        from_amount=Decimal("120"),
        to_amount=Decimal("110"),
        rate=Decimal("0.916666"),
        meta={},
    ))

    # Check each currency wallet has correct net balance
    gbp_total = sum(e.amount for e in db_session.query(models.JournalEntry)
                    .filter(models.JournalEntry.account_id == gbp.id))
    usd_total = sum(e.amount for e in db_session.query(models.JournalEntry)
                    .filter(models.JournalEntry.account_id == usd.id))
    eur_total = sum(e.amount for e in db_session.query(models.JournalEntry)
                    .filter(models.JournalEntry.account_id == eur.id))

    assert gbp_total == Decimal("-100")
    assert usd_total == Decimal("0")      # in/out net to zero
    assert eur_total == Decimal("110")


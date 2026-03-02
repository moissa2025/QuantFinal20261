from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas.trial_balance import TrialBalancePerCurrencyResponse

router = APIRouter(prefix="/trial-balance", tags=["trial-balance"])


@router.get("/per-currency", response_model=TrialBalancePerCurrencyResponse)
def trial_balance_per_currency(db: Session = Depends(get_db)):
    rows = (
        db.query(
            models.Account.currency,
            models.JournalEntry.amount,
            models.JournalEntry.account_id,
        )
        .join(models.Account, models.Account.id == models.JournalEntry.account_id)
        .all()
    )

    balances: dict[str, Decimal] = {}
    for currency, amount, _ in rows:
        balances.setdefault(currency, Decimal("0"))
        balances[currency] += amount

    # --- REQUIRED: convert Decimal → plain string (no .00, no exponent) ---
    def decimal_to_plain_string(d: Decimal) -> str:
        s = format(d, "f")  # force plain decimal, no exponent
        if "." in s:
            s = s.rstrip("0").rstrip(".")
        return s

    normalized = {k: decimal_to_plain_string(v) for k, v in balances.items()}

    return TrialBalancePerCurrencyResponse(per_currency=normalized)

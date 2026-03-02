from decimal import Decimal
from datetime import datetime, timezone as tz
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.schemas.health import LedgerHealth


def get_ledger_health(db: Session) -> LedgerHealth:
    # Sum amounts per transaction
    rows = (
        db.query(
            models.JournalEntry.transaction_id,
            func.sum(models.JournalEntry.amount).label("total")
        )
        .group_by(models.JournalEntry.transaction_id)
        .all()
    )

    # Ledger is balanced if every transaction sums to zero
    is_balanced = all(Decimal(row.total) == Decimal("0") for row in rows)

    return LedgerHealth(
        is_balanced=is_balanced,
        total=Decimal("0"),  # global total meaningless in multi-currency
        checked_at=datetime.now(tz.utc),
    )

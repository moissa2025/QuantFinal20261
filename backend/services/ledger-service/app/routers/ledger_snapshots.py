from decimal import Decimal
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas.snapshots import LedgerSnapshotResponse

router = APIRouter(prefix="/snapshots", tags=["snapshots"])


@router.get("/ledger", response_model=LedgerSnapshotResponse)
def ledger_snapshot(
    at: datetime | None = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.JournalEntry)

    if at:
        q = q.filter(models.JournalEntry.created_at <= at)

    entries = q.all()

    balances: dict[str, Decimal] = {}
    for e in entries:
        key = str(e.account_id)
        balances.setdefault(key, Decimal("0"))
        balances[key] += e.amount

    # Return raw Decimals; schema handles Money formatting
    def decimal_to_plain_string(d):
        # Convert Decimal to string without scientific notation or trailing zeros
        s = format(d, 'f')  # force plain decimal, no exponent
        if '.' in s:
            s = s.rstrip('0').rstrip('.')  # remove trailing zeros and dot
        return s

    normalized = {k: decimal_to_plain_string(v) for k, v in balances.items()}
    return LedgerSnapshotResponse(as_of=at, balances=normalized)


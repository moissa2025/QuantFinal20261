from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas.regulatory import RegulatoryDailySummaryResponse

router = APIRouter(prefix="/regulatory", tags=["regulatory"])


@router.get("/daily-summary", response_model=RegulatoryDailySummaryResponse)
def regulatory_daily_summary(
    for_date: date = Query(...),
    db: Session = Depends(get_db),
):
    txns = (
        db.query(models.Transaction)
        .filter(models.Transaction.created_at >= for_date)
        .all()
    )

    count = len(txns)

    entries = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.created_at >= for_date)
        .all()
    )
    total_volume = sum(abs(e.amount) for e in entries)
    def decimal_to_plain_string(d):
        s = format(d, 'f')  # force plain decimal, no exponent
        if '.' in s:
            s = s.rstrip('0').rstrip('.')
        return s

    return RegulatoryDailySummaryResponse(
        date=for_date,
        transaction_count=count,
        total_volume=decimal_to_plain_string(total_volume),
    )


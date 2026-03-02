from datetime import date, datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas.intraday import IntradayPnlResponse

router = APIRouter(prefix="/pnl", tags=["pnl"])


@router.get("/intraday", response_model=IntradayPnlResponse)
def intraday_pnl(
    for_date: date = Query(...),
    db: Session = Depends(get_db),
):
    start = datetime.combine(for_date, datetime.min.time())
    end = datetime.combine(for_date, datetime.max.time())

    entries = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.created_at >= start)
        .filter(models.JournalEntry.created_at <= end)
        .all()
    )

    total = sum(e.amount for e in entries)

    return IntradayPnlResponse(date=for_date, pnl=str(total.normalize()))


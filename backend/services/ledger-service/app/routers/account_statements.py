from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app import models

router = APIRouter(prefix="/accounts", tags=["account_statements"])


@router.get("/{account_id}/statement")
def account_statement(
    account_id: str,
    from_date: datetime | None = Query(None),
    to_date: datetime | None = Query(None),
    db: Session = Depends(get_db),
):
    q = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.account_id == account_id)
        .order_by(models.JournalEntry.created_at)
    )

    if from_date:
        q = q.filter(models.JournalEntry.created_at >= from_date)
    if to_date:
        q = q.filter(models.JournalEntry.created_at <= to_date)

    entries = q.all()

    return [
        {
            "id": e.id,
            "created_at": e.created_at,
            "amount": e.amount,
            "reference": e.reference,
            "meta": e.meta,
        }
        for e in entries
    ]

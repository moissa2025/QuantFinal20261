from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models

router = APIRouter(prefix="/journal", tags=["journal"])


@router.get("")
def list_journal_entries(limit: int = 50, cursor: int | None = None, db: Session = Depends(get_db)):
    query = db.query(models.JournalEntry).order_by(models.JournalEntry.id)

    if cursor:
        query = query.filter(models.JournalEntry.id > cursor)

    items = query.limit(limit).all()

    next_cursor = items[-1].id if len(items) == limit else None

    return {
        "items": [
            {
                "id": j.id,
                "transaction_id": j.transaction_id,
                "account_id": j.account_id,
                "amount": j.amount,
                "reference": j.reference,
                "meta": j.meta,
            }
            for j in items
        ],
        "next_cursor": next_cursor,
    }

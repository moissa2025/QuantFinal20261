from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/transactions")
def audit_transactions(db: Session = Depends(get_db)):
    txns = db.query(models.Transaction).order_by(models.Transaction.created_at).all()
    return [
        {
            "id": t.id,
            "type": t.type,
            "correlation_id": t.correlation_id,
            "created_at": t.created_at,
        }
        for t in txns
    ]


@router.get("/journal-entries")
def audit_journal_entries(db: Session = Depends(get_db)):
    entries = (
        db.query(models.JournalEntry)
        .order_by(models.JournalEntry.created_at)
        .all()
    )
    return [
        {
            "id": e.id,
            "transaction_id": e.transaction_id,
            "account_id": e.account_id,
            "amount": e.amount,
            "reference": e.reference,
            "meta": e.meta,
            "created_at": e.created_at,
        }
        for e in entries
    ]

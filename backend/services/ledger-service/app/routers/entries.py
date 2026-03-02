from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models
from app.schemas.entries import SimpleEntry, SimpleEntryCreate

router = APIRouter(prefix="/entries", tags=["entries"])


# ---------------------------------------------------------
# SIMPLE ENTRY ENDPOINT (used by pagination tests)
# ---------------------------------------------------------
@router.post("/", response_model=SimpleEntry)
def create_simple_entry(payload: SimpleEntryCreate, db: Session = Depends(get_db)):
    """
    This endpoint exists ONLY for test seeding.
    It inserts a single JournalEntry with a dummy Transaction.
    """

    # 1. Validate account exists
    account = (
        db.query(models.Account)
        .filter(models.Account.id == payload.account_id)
        .first()
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Create a dummy transaction (required by FK)
    tx = models.Transaction(
        type="test_entry",
        correlation_id=None,
    )
    db.add(tx)
    db.flush()  # ensures tx.id is available

    # 3. Insert a single journal entry
    je = models.JournalEntry(
        transaction_id=tx.id,
        account_id=payload.account_id,
        amount=Decimal(payload.amount),  # MoneyField gives string → Decimal OK
        currency=payload.currency,
        description=payload.description,
        meta={},  # your schema no longer includes meta
    )
    db.add(je)
    db.commit()
    db.refresh(je)

    return je


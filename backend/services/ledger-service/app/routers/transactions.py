from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/", response_model=schemas.TransactionCreate)
def post_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):

    # Rule 1: Must have at least two entries
    if len(tx.entries) < 2:
        raise HTTPException(status_code=400, detail="A transaction must contain at least two entries")

    # Rule 2: Must balance to zero
    total = sum([e.amount for e in tx.entries])
    if round(total, 8) != 0:
        raise HTTPException(status_code=400, detail="Transaction entries must balance to zero")

    # Rule 3: Validate all accounts exist
    for entry in tx.entries:
        account = db.query(models.Account).filter(models.Account.id == entry.account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail=f"Account not found: {entry.account_id}")

    # Rule 4: Optional idempotency
    if tx.correlation_id:
        existing = db.query(models.Transaction).filter(
            models.Transaction.correlation_id == tx.correlation_id
        ).first()
        if existing:
            return existing  # idempotent return

    # Create transaction
    new_tx = models.Transaction(
        type=tx.type,
        correlation_id=tx.correlation_id
    )
    db.add(new_tx)
    db.flush()  # get transaction.id before creating entries

    # Create entries
    for entry in tx.entries:
        db_entry = models.JournalEntry(
            transaction_id=new_tx.id,
            account_id=entry.account_id,
            amount=entry.amount,
            meta=entry.meta
        )
        db.add(db_entry)

    # Commit atomically
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to post transaction")

    db.refresh(new_tx)
    return new_tx

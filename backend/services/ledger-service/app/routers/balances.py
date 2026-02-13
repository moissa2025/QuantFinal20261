from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db
from app import models, schemas
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/balances", tags=["balances"])

@router.get("/{account_id}", response_model=schemas.AccountBalance)
def get_account_balance(account_id: UUID, db: Session = Depends(get_db)):

    # 1. Ensure account exists
    account = db.query(models.Account).filter(models.Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Sum all journal entries for this account
    total = (
        db.query(func.coalesce(func.sum(models.JournalEntry.amount), 0))
        .filter(models.JournalEntry.account_id == account_id)
        .scalar()
    )

    return schemas.AccountBalance(
        account_id=account_id,
        balance=total,
        currency=account.currency,
        as_of=datetime.now(datetime.UTC) 
    )

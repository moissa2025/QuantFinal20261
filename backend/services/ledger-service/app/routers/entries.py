from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/entries", tags=["entries"])

@router.post("/", response_model=schemas.JournalEntry)
def post_entry(entry: schemas.JournalEntryCreate, db: Session = Depends(get_db)):

    # 1. Validate account exists
    account = db.query(models.Account).filter(models.Account.id == entry.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Create the journal entry
    new_entry = models.JournalEntry(
        account_id=entry.account_id,
        amount=entry.amount,
        meta=entry.meta
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return new_entry


@router.get("/", response_model=list[schemas.JournalEntry])
def list_entries(db: Session = Depends(get_db)):
    return db.query(models.JournalEntry).all()

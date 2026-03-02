from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db import get_db
from app.services.reversal import reverse_transaction
from app.schemas.reversals import ReversalResult

router = APIRouter(prefix="/reversals", tags=["reversals"])


@router.post("/{transaction_id}", response_model=ReversalResult)
def reverse(transaction_id: UUID, db: Session = Depends(get_db)):
    try:
        return reverse_transaction(db, transaction_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


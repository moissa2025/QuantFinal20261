from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.services.fx_posting import post_fx_journal
from app.schemas.fx import FxPostingCreate
from app.schemas.posting import JournalEntryOut

router = APIRouter(prefix="/fx", tags=["fx"])


@router.post("/", response_model=JournalEntryOut)
def fx_post(payload: FxPostingCreate, db: Session = Depends(get_db)):
    try:
        return post_fx_journal(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


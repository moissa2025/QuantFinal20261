from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/accounts", tags=["accounts"])

@router.post("/", response_model=schemas.Account)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    new_account = models.Account(**account.model_dump())
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

@router.get("/", response_model=list[schemas.Account])
def list_accounts(db: Session = Depends(get_db)):
    return db.query(models.Account).all()


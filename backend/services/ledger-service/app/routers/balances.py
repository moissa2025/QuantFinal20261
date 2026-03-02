from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.services.balances import get_account_balance, get_trial_balance
from app.schemas.balances import AccountBalance, TrialBalance

router = APIRouter(prefix="/balances", tags=["balances"])


@router.get("/account/{account_id}", response_model=AccountBalance)
def account_balance(account_id: str, db: Session = Depends(get_db)):
    return get_account_balance(db, account_id)


@router.get("/trial", response_model=TrialBalance)
def trial_balance(db: Session = Depends(get_db)):
    return get_trial_balance(db)


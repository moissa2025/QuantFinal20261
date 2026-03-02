from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.health import LedgerHealth
from app.services.health import get_ledger_health

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/ledger", response_model=LedgerHealth)
def ledger_health(db: Session = Depends(get_db)):
    return get_ledger_health(db)

@router.get("/live")
def live():
    return {"status": "live"}

@router.get("/ready")
def ready():
    return {"status": "ready"}


from . import health, accounts, entries
from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/live")
def live():
    return {"status": "live"}

@router.get("/ready")
def ready():
    return {"status": "ready"}


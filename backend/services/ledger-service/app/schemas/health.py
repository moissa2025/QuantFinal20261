# app/schemas/health.py
from pydantic import BaseModel

class LedgerHealth(BaseModel):
    status: str
    details: dict | None = None


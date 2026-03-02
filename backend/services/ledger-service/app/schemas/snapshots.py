from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel


class LedgerSnapshotResponse(BaseModel):
    as_of: Optional[datetime]
    balances: Dict[str, str]  # <-- return strings, not MoneyField

    class Config:
        from_attributes = True


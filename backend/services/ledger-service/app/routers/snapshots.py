from datetime import datetime
from decimal import Decimal
from typing import Dict, Optional

from pydantic import BaseModel
from app.schemas.fields import MoneyField


class LedgerSnapshotResponse(BaseModel):
    as_of: Optional[datetime]
    balances: Dict[str, MoneyField]

    class Config:
        from_attributes = True

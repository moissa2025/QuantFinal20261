from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel


class JournalLine(BaseModel):
    id: UUID
    account_id: UUID
    amount: Decimal
    direction: str
    meta: Optional[dict]
    reference: str

    class Config:
        from_attributes = True


class JournalEntryOut(BaseModel):
    id: UUID
    reference: str
    created_at: datetime
    meta: Optional[dict]
    lines: List[JournalLine]

    class Config:
        from_attributes = True

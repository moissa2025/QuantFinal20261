from datetime import datetime
from uuid import UUID
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel
from app.schemas.fields import MoneyField


class StatementEntry(BaseModel):
    entry_id: UUID
    transaction_id: Optional[UUID]
    amount: MoneyField
    balance_after: MoneyField
    meta: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True


class AccountStatement(BaseModel):
    account_id: UUID
    currency: str
    opening_balance: MoneyField
    entries: List[StatementEntry]
    closing_balance: MoneyField
    as_of: datetime
    next_cursor: Optional[UUID] = None

    class Config:
        from_attributes = True

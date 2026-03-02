from datetime import datetime
from uuid import UUID
from decimal import Decimal
from typing import List

from pydantic import BaseModel
from app.schemas.fields import MoneyField


class AccountBalance(BaseModel):
    account_id: UUID
    balance: MoneyField
    currency: str
    as_of: datetime

    class Config:
        from_attributes = True


class TrialBalanceLine(BaseModel):
    account_id: UUID
    name: str
    balance: MoneyField
    currency: str

    class Config:
        from_attributes = True


class TrialBalance(BaseModel):
    lines: List[TrialBalanceLine]
    total: MoneyField
    is_balanced: bool
    as_of: datetime

    class Config:
        from_attributes = True

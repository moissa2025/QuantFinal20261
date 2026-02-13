from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal

# Account Schemas
# -------------------------
class AccountCreate(BaseModel):
    name: str
    type: str
    user_id: UUID
    currency: str

class Account(BaseModel):
    id: UUID
    name: str
    type: str
    user_id: Optional[UUID]
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# Journal Entry Schemas
# -------------------------
class JournalEntryCreate(BaseModel):
    account_id: UUID
    amount: float
    meta: Optional[dict] = None   # aligned with SQLAlchemy

class JournalEntry(BaseModel):
    id: UUID
    account_id: UUID
    amount: float
    meta: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# Transaction Schemas
# -------------------------
class TransactionCreate(BaseModel):
    type: str
    correlation_id: Optional[str] = None
    entries: List[JournalEntryCreate]
#--------------------------
#Balance Schema
#---------------------------
class AccountBalance(BaseModel):
    account_id: UUID
    balance: Decimal
    currency: str
    as_of: datetime

#-----------------------------
#Statement Entry
#------------------------------
class StatementEntry(BaseModel):
    entry_id: UUID
    transaction_id: UUID | None
    amount: Decimal
    balance_after: Decimal
    meta: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True

#-----------------------------
#Account Statement
#------------------------------
class AccountStatement(BaseModel):
    account_id: UUID
    currency: str
    opening_balance: Decimal
    entries: List[StatementEntry]
    closing_balance: Decimal
    as_of: datetime
    next_cursor: Optional[UUID] = None

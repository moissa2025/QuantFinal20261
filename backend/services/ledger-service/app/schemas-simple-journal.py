from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal
import enum
#-------------------Posting
class PostingType(str, enum.Enum):
    trade = "trade"
    deposit = "deposit"
    withdrawal = "withdrawal"
    fee = "fee"
    adjustment = "adjustment"
    fx = "fx"
    reversal = "reversal"
    other = "other"
# ----------------- Accounts -----------------

class AccountCreate(BaseModel):
    name: str
    type: str
    user_id: UUID
    currency: str
    is_suspense: bool = False

class Account(BaseModel):
    id: UUID
    name: str
    type: str
    user_id: Optional[UUID]
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True


# ----------------- Simple entry (for /entries) -----------------

class SimpleEntryCreate(BaseModel):
    account_id: UUID
    amount: Decimal
    meta: Optional[dict] = None


# ----------------- Posting engine -----------------

class JournalLineCreate(BaseModel):
    account_id: UUID
    amount: Decimal
    direction: str  # "debit" or "credit"
    meta: Optional[dict] = None


class JournalEntryCreate(BaseModel):
    reference: str
    lines: List[JournalLineCreate]
    meta: Optional[dict] = None
    posting_type: PostingType = PostingType.other

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

class FxPostingCreate(BaseModel):
    reference: str
    from_account_id: UUID
    to_account_id: UUID
    from_amount: Decimal
    to_amount: Decimal
    rate: Decimal
    meta: Optional[dict] = None

# ----------------- Statement / balances (unchanged) -----------------

class AccountBalance(BaseModel):
    account_id: UUID
    balance: Decimal
    currency: str
    as_of: datetime


class StatementEntry(BaseModel):
    entry_id: UUID
    transaction_id: Optional[UUID]
    amount: Decimal
    balance_after: Decimal
    meta: Optional[dict]
    created_at: datetime

    class Config:
        from_attributes = True


class AccountStatement(BaseModel):
    account_id: UUID
    currency: str
    opening_balance: Decimal
    entries: List[StatementEntry]
    closing_balance: Decimal
    as_of: datetime
    next_cursor: Optional[UUID] = None

# --- existing AccountBalance already present ---
# class AccountBalance(BaseModel):
#     account_id: UUID
#     balance: Decimal
#     currency: str
#     as_of: datetime

class TrialBalanceLine(BaseModel):
    account_id: UUID
    name: str
    balance: Decimal
    currency: str

class TrialBalance(BaseModel):
    lines: List[TrialBalanceLine]
    total: Decimal
    is_balanced: bool
    as_of: datetime


class ReversalResult(BaseModel):
    original_transaction_id: UUID
    reversal_transaction_id: UUID
    reference: str
    created_at: datetime

class LedgerHealth(BaseModel):
    is_balanced: bool
    total: Decimal
    checked_at: datetime

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from app.schemas.fields import MoneyField


class SimpleEntryCreate(BaseModel):
    account_id: UUID
    amount: MoneyField
    currency: str
    description: str | None = None


class SimpleEntry(BaseModel):
    id: UUID
    account_id: UUID
    amount: MoneyField
    currency: str
    description: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

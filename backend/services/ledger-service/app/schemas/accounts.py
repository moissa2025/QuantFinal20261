from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AccountCreate(BaseModel):
    name: str
    type: str
    user_id: Optional[UUID]
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

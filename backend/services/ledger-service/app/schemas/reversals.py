from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class ReversalResult(BaseModel):
    original_transaction_id: UUID
    reversal_transaction_id: UUID
    reference: str
    created_at: datetime

    class Config:
        from_attributes = True


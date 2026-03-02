from uuid import UUID
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class FxPostingCreate(BaseModel):
    reference: str
    from_account_id: UUID
    to_account_id: UUID
    from_amount: Decimal
    to_amount: Decimal
    rate: Decimal
    meta: Optional[dict] = None


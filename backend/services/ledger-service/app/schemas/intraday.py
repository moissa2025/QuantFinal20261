from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class IntradayPnlResponse(BaseModel):
    date: date
    pnl: str  # <-- return as string, not MoneyField

    class Config:
        from_attributes = True


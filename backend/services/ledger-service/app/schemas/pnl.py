# app/schemas/pnl.py
from datetime import date
from pydantic import BaseModel
from app.schemas.fields import MoneyField


class IntradayPnlResponse(BaseModel):
    date: date
    pnl: MoneyField


# app/schemas/regulatory.py
from datetime import date
from pydantic import BaseModel
from app.schemas.fields import MoneyField


class RegulatoryDailySummaryResponse(BaseModel):
    date: date
    transaction_count: int
    total_volume: str

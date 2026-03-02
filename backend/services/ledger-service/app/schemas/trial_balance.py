# app/schemas/trial_balance.py
from typing import Dict
from pydantic import BaseModel
from app.schemas.fields import MoneyField


class TrialBalancePerCurrencyResponse(BaseModel):
    per_currency: Dict[str, str]


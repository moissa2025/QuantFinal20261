from decimal import Decimal
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import get_db
from app import models

router = APIRouter(prefix="/bulk-postings", tags=["bulk_postings"])


class BulkJournalLine(BaseModel):
    transaction_ref: str
    account_id: str
    amount: Decimal
    meta: dict = {}


class BulkPostingRequest(BaseModel):
    lines: list[BulkJournalLine]


@router.post("")
def ingest_bulk_postings(payload: BulkPostingRequest, db: Session = Depends(get_db)):
    txns: dict[str, models.Transaction] = {}

    for line in payload.lines:
        if line.transaction_ref not in txns:
            txn = models.Transaction(type="bulk", correlation_id=line.transaction_ref)
            db.add(txn)
            db.flush()
            txns[line.transaction_ref] = txn
        else:
            txn = txns[line.transaction_ref]

        db.add(
            models.JournalEntry(
                transaction_id=txn.id,
                account_id=line.account_id,
                amount=line.amount,
                reference=line.transaction_ref,
                meta=line.meta,
            )
        )

    db.commit()
    return {"status": "ok", "transactions": list(txns.keys())}

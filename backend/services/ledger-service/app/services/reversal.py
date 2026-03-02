from decimal import Decimal
from uuid import UUID
from sqlalchemy.orm import Session
from datetime import datetime, timezone as tz

from app import models
from app.schemas.reversals import ReversalResult


def reverse_transaction(db: Session, transaction_id: UUID) -> ReversalResult:
    # 1. Load original transaction + entries
    original_tx = (
        db.query(models.Transaction)
        .filter(models.Transaction.id == transaction_id)
        .first()
    )
    if not original_tx:
        raise ValueError("Original transaction not found")

    # Prevent double reversal
    existing_reversal = (
        db.query(models.Transaction)
        .filter(models.Transaction.reversal_of_id == original_tx.id)
        .first()
    )
    if existing_reversal:
        return ReversalResult(
            original_transaction_id=original_tx.id,
            reversal_transaction_id=existing_reversal.id,
            reference=original_tx.correlation_id or "",
            created_at=existing_reversal.created_at,
        )

    entries = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.transaction_id == original_tx.id)
        .all()
    )
    if not entries:
        raise ValueError("No journal entries to reverse")

    # 2. Create reversal transaction
    reversal_tx = models.Transaction(
        type="reversal",
        correlation_id=original_tx.correlation_id,
        reversal_of_id=original_tx.id,
    )
    db.add(reversal_tx)
    db.flush()

    # 3. Create opposite entries
    for e in entries:
        rev_entry = models.JournalEntry(
            transaction_id=reversal_tx.id,
            account_id=e.account_id,
            amount=Decimal("0") - e.amount,
            meta={"reversal_of_entry_id": str(e.id), **(e.meta or {})},
            reference=e.reference,
        )
        db.add(rev_entry)

    db.commit()
    db.refresh(reversal_tx)

    return ReversalResult(
        original_transaction_id=original_tx.id,
        reversal_transaction_id=reversal_tx.id,
        reference=original_tx.correlation_id or "",
        created_at=reversal_tx.created_at,
    )

from decimal import Decimal
from sqlalchemy.orm import Session

from app import models
from app.schemas.fx import FxPostingCreate
from app.schemas.posting import JournalLine, JournalEntryOut


# ---------------------------------------------------------
# Helper: Load existing FX posting (idempotency)
# ---------------------------------------------------------
def load_existing_fx_posting(db: Session, reference: str):
    txn = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.type == "fx",
            models.Transaction.correlation_id == reference,
        )
        .first()
    )

    if not txn:
        return None

    entries = (
        db.query(models.JournalEntry)
        .filter(models.JournalEntry.transaction_id == txn.id)
        .all()
    )

    lines = [
        JournalLine(
            id=e.id,
            account_id=e.account_id,
            amount=e.amount,
            direction="debit" if e.amount > 0 else "credit",
            meta=e.meta,
            reference=e.reference,
        )
        for e in entries
    ]

    return JournalEntryOut(
        id=txn.id,
        reference=txn.correlation_id,
        created_at=txn.created_at,
        meta={},
        lines=lines,
    )


# ---------------------------------------------------------
# Helper: Get or auto-create suspense account
# ---------------------------------------------------------
def get_or_create_suspense_account(db: Session, template_acc: models.Account):
    suspense = (
        db.query(models.Account)
        .filter(models.Account.is_suspense == True)
        .first()
    )

    if suspense:
        return suspense

    suspense = models.Account(
        name="Suspense",
        type=template_acc.type,
        currency=template_acc.currency,
        is_suspense=True,
    )
    db.add(suspense)
    db.flush()
    return suspense


# ---------------------------------------------------------
# Helper: Balance transaction using suspense
# ---------------------------------------------------------
def balance_transaction_with_suspense(
    db: Session,
    txn: models.Transaction,
    journal_rows: list[models.JournalEntry],
    template_acc: models.Account,
):
    total = sum(j.amount for j in journal_rows)

    if total == 0:
        return journal_rows

    suspense = get_or_create_suspense_account(db, template_acc)

    journal_rows.append(
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=suspense.id,
            amount=total * Decimal("-1"),
            reference=journal_rows[0].reference,
            meta={"fx_suspense": True},
        )
    )

    return journal_rows


# ---------------------------------------------------------
# FX posting engine (clean, modular, idempotent)
# ---------------------------------------------------------
def post_fx_journal(db: Session, payload: FxPostingCreate):
    # 1. Idempotency
    existing = load_existing_fx_posting(db, payload.reference)
    if existing:
        return existing

    # 2. Load accounts
    from_acc = (
        db.query(models.Account)
        .filter(models.Account.id == payload.from_account_id)
        .first()
    )
    to_acc = (
        db.query(models.Account)
        .filter(models.Account.id == payload.to_account_id)
        .first()
    )

    if not from_acc or not to_acc:
        raise ValueError("Accounts not found")

    # 3. Create transaction
    txn = models.Transaction(type="fx", correlation_id=payload.reference)
    db.add(txn)
    db.flush()

    # 4. Create FX legs
    journal_rows = [
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=from_acc.id,
            amount=payload.from_amount.quantize(Decimal("0.01")) * Decimal("-1"),
            reference=payload.reference,
            meta={"currency": from_acc.currency, "rate": str(payload.rate), "leg": "from"},
        ),
        models.JournalEntry(
            transaction_id=txn.id,
            account_id=to_acc.id,
            amount=payload.to_amount.quantize(Decimal("0.01")),
            reference=payload.reference,
            meta={"currency": to_acc.currency, "rate": str(payload.rate), "leg": "to"},
        ),
    ]

    # 5. Balance using suspense
    journal_rows = balance_transaction_with_suspense(db, txn, journal_rows, from_acc)

    # 6. Persist rows
    for j in journal_rows:
        db.add(j)

    db.commit()
    db.refresh(txn)

    return load_existing_fx_posting(db, payload.reference)


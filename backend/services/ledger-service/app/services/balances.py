from decimal import Decimal
from uuid import UUID
from datetime import datetime, timezone as tz
from sqlalchemy.orm import Session
from sqlalchemy import func

from app import models
from app.schemas.balances import AccountBalance, TrialBalance, TrialBalanceLine


def get_account_balance(db: Session, account_id: UUID) -> AccountBalance:
    account = (
        db.query(models.Account)
        .filter(models.Account.id == account_id)
        .first()
    )
    if not account:
        raise ValueError("Account not found")

    total = (
        db.query(func.coalesce(func.sum(models.JournalEntry.amount), 0))
        .filter(models.JournalEntry.account_id == account_id)
        .scalar()
    )

    return AccountBalance(
        account_id=account.id,
        balance=Decimal(total),
        currency=account.currency,
        as_of=datetime.now(tz.utc),
    )


def get_trial_balance(db: Session) -> TrialBalance:
    # Account balances (unchanged)
    rows = (
        db.query(
            models.Account.id,
            models.Account.name,
            models.Account.currency,
            func.coalesce(func.sum(models.JournalEntry.amount), 0).label("balance"),
        )
        .outerjoin(models.JournalEntry, models.JournalEntry.account_id == models.Account.id)
        .group_by(models.Account.id, models.Account.name, models.Account.currency)
        .order_by(models.Account.name.asc())
        .all()
    )

    lines = [
        TrialBalanceLine(
            account_id=row.id,
            name=row.name,
            balance=Decimal(row.balance),
            currency=row.currency,
        )
        for row in rows
    ]

    # Per-transaction balancing (correct definition of ledger balance)
    txn_rows = (
        db.query(
            models.JournalEntry.transaction_id,
            func.sum(models.JournalEntry.amount).label("total")
        )
        .group_by(models.JournalEntry.transaction_id)
        .all()
    )

    is_balanced = all(Decimal(r.total) == Decimal("0") for r in txn_rows)

    return TrialBalance(
        lines=lines,
        total=Decimal("0"),  # global total meaningless in multi-currency
        is_balanced=is_balanced,
        as_of=datetime.now(tz.utc),
    )

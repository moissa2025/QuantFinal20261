print(">>> LOADED LOCAL statements.py <<<")

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, or_, func
from sqlalchemy.orm import Session
from uuid import UUID
from decimal import Decimal
from datetime import datetime, UTC
from dateutil.parser import isoparse

from app.db import get_db
from app import models, schemas

router = APIRouter(prefix="/statements", tags=["statements"])


def normalize_iso(dt: str | None):
    if not dt:
        return None

    # Fix FastAPI decoding "+00:00" into " 00:00"
    # Only replace the LAST space, not all spaces
    if " " in dt and dt.strip().endswith(("00:00", "01:00", "02:00")):
        dt = dt.rsplit(" ", 1)[0] + "+" + dt.rsplit(" ", 1)[1]

    return isoparse(dt).astimezone(UTC)


@router.get("/{account_id}", response_model=schemas.AccountStatement)
def get_statements(
    account_id: UUID,
    limit: int = 50,
    cursor: str | None = None,
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    db: Session = Depends(get_db),
):
    print("DEBUG: entered endpoint")

    # 1. Validate account
    account = (
        db.query(models.Account)
        .filter(models.Account.id == account_id)
        .first()
    )
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 2. Parse from/to dates
    from_date = normalize_iso(from_date)
    to_date = normalize_iso(to_date)

    # 3. Opening balance
    if from_date:
        opening_balance_raw = (
            db.query(func.coalesce(func.sum(models.JournalEntry.amount), 0))
            .filter(models.JournalEntry.account_id == account_id)
            .filter(models.JournalEntry.created_at < from_date)
            .scalar()
        )
    else:
        opening_balance_raw = Decimal("0")

    opening_balance = Decimal(opening_balance_raw)

    # 4. Base query
    q = db.query(models.JournalEntry).filter(
        models.JournalEntry.account_id == account_id
    )

    if from_date:
        q = q.filter(models.JournalEntry.created_at >= from_date)
    if to_date:
        q = q.filter(models.JournalEntry.created_at <= to_date)

    # 5. Apply cursor
    if cursor:
        cursor_entry = (
            db.query(models.JournalEntry)
            .filter(
                models.JournalEntry.id == cursor,
                models.JournalEntry.account_id == account_id,
            )
            .first()
        )
        if not cursor_entry:
            raise HTTPException(status_code=400, detail="Invalid cursor")

        cursor_ts = cursor_entry.created_at
        cursor_id = cursor_entry.id

        q = q.filter(
            or_(
                models.JournalEntry.created_at > cursor_ts,
                and_(
                    models.JournalEntry.created_at == cursor_ts,
                    models.JournalEntry.id > cursor_id,
                ),
            )
        )

        print("DEBUG A cursor_in:", cursor)
        print("DEBUG A cursor_ts:", cursor_ts)
        print("DEBUG A cursor_entry_id:", cursor_entry.id)
    else:
        print("DEBUG A cursor_in: None")

    # 6. Deterministic ordering
    q = q.order_by(
        models.JournalEntry.created_at.asc(),
        models.JournalEntry.id.asc(),
    )

    # 7. Fetch limit + 1 rows
    rows = q.limit(limit + 1).all()

    # 8. Determine page and next_cursor
    if len(rows) > limit:
        page_rows = rows[:limit]
        last = page_rows[-1]          # last returned row
        next_cursor = last.id         # correct cursor
    else:
        page_rows = rows
        next_cursor = None

    # DEBUG BLOCK B
    print("DEBUG B total_rows_fetched:", len(rows))
    print("DEBUG B page_rows_len:", len(page_rows))
    print("DEBUG B page_ids:", [str(e.id) for e in page_rows])
    print("DEBUG B next_cursor:", next_cursor)

    # 9. Running balance
    running_balance = opening_balance
    statement_entries: list[schemas.StatementEntry] = []

    for e in page_rows:
        running_balance += Decimal(e.amount)
        statement_entries.append(
            schemas.StatementEntry(
                entry_id=e.id,
                transaction_id=e.transaction_id,
                amount=e.amount,
                balance_after=running_balance,
                meta=e.meta,
                created_at=e.created_at,
            )
        )

    return schemas.AccountStatement(
        account_id=account_id,
        currency=account.currency,
        opening_balance=opening_balance,
        entries=statement_entries,
        closing_balance=running_balance,
        as_of=datetime.now(UTC),
        next_cursor=next_cursor,
    )

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import models

def post_transaction(db: Session, tx_data):
    try:
        # 1. Create transaction shell
        tx = models.Transaction(
            type=tx_data.type,
            correlation_id=tx_data.correlation_id
        )
        db.add(tx)
        db.flush()

        total_debits = 0
        total_credits = 0

        # 2. Process entries
        for entry in tx_data.entries:

            # Validate account exists
            account = db.query(models.Account).filter_by(id=entry.account_id).first()
            if not account:
                raise Exception(f"Invalid account_id: {entry.account_id}")

            # Validate precision (if asset-based)
            if hasattr(account, "precision"):
                rounded = round(entry.amount, account.precision)
                if rounded != entry.amount:
                    raise Exception(
                        f"Amount {entry.amount} exceeds precision {account.precision} "
                        f"for asset {account.currency}"
                    )

            # Create journal entry
            je = models.JournalEntry(
                transaction_id=tx.id,
                account_id=entry.account_id,
                amount=entry.amount,
                direction=entry.direction,
                metadata=entry.metadata
            )
            db.add(je)

            # Track totals
            if entry.direction == "debit":
                total_debits += entry.amount
            elif entry.direction == "credit":
                total_credits += entry.amount
            else:
                raise Exception(f"Invalid direction: {entry.direction}")

        # 3. Enforce double-entry rule
        if round(total_debits, 8) != round(total_credits, 8):
            raise Exception(
                f"Double-entry mismatch: debits={total_debits}, credits={total_credits}"
            )

        # 4. Commit atomically
        db.commit()
        return tx

    except Exception as e:
        db.rollback()
        raise e


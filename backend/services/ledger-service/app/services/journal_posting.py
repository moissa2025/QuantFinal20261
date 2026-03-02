from app.schemas import SimpleJournalEntryCreate
from app import models, schemas
def post_journal_entry(db, payload: SimpleJournalEntryCreate):
    entry = models.JournalEntry(
        transaction_id=payload.transaction_id,
        account_id=payload.account_id,
        amount=payload.amount,
        reference=payload.reference,
        meta=payload.meta,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

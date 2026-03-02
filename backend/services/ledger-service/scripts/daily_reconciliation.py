import os
from datetime import datetime, timezone as tz
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker

from app import models
from app.config import settings  # assuming you already have this


def main():
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        total = (
            db.query(func.coalesce(func.sum(models.JournalEntry.amount), 0))
            .scalar()
        )
        is_balanced = (total == 0)
        print(f"[{datetime.now(tz.utc).isoformat()}] Trial balance total={total}, balanced={is_balanced}")
        if not is_balanced:
            # here you could write to a table, send alert, etc.
            print("WARNING: Ledger not balanced!")
    finally:
        db.close()


if __name__ == "__main__":
    main()

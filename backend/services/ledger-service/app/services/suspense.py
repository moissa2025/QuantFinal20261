from sqlalchemy.orm import Session
from app import models


def get_suspense_account(db: Session) -> models.Account:
    acc = db.query(models.Account).filter(models.Account.is_suspense.is_(True)).first()
    if not acc:
        raise ValueError("Suspense account not configured")
    return acc

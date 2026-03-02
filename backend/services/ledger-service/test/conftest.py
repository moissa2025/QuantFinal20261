import pytest
from fastapi.testclient import TestClient

from app.db_base import Base
from app.main import app
from app.db import SessionLocal, get_db
from app import models


# ---------------------------------------------------------
# CLEAN PRODUCTION DB BEFORE EACH TEST
# ---------------------------------------------------------

@pytest.fixture(scope="function", autouse=True)
def clean_db():
    # Close all sessions
    SessionLocal.close_all()

    # Wipe all tables using the production engine
    engine = SessionLocal.kw["bind"]
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())


# ---------------------------------------------------------
# DB session fixture (uses production DB)
# ---------------------------------------------------------

@pytest.fixture
def db_session(clean_db):
    db = SessionLocal()
    try:
        yield db
        db.rollback()
    finally:
        db.close()


# ---------------------------------------------------------
# FastAPI dependency override (uses production DB)
# ---------------------------------------------------------

def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db


# ---------------------------------------------------------
# TestClient (depends on clean_db)
# ---------------------------------------------------------

@pytest.fixture
def client(clean_db):
    return TestClient(app)


# ---------------------------------------------------------
# Helper fixture: create_account
# ---------------------------------------------------------

@pytest.fixture
def create_account(db_session):
    def _create_account(name: str, currency: str):
        acc = models.Account(
            name=name,
            type="wallet",
            currency=currency,
            is_suspense=False,
        )
        db_session.add(acc)
        db_session.flush()
        return acc

    return _create_account

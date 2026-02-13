
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
from app.db import Base, engine

@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


from app.db import Base, get_db
from app.main import app
from app.models import Account, JournalEntry, Transaction

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base, get_db
from app.main import app
from app.models import Account, JournalEntry

#TEST_DATABASE_URL = "sqlite:///:memory:"

#engine = create_engine(
#    TEST_DATABASE_URL,
#    connect_args={"check_same_thread": False}
#)

#TestingSessionLocal = sessionmaker(
#    autocommit=False,
#    autoflush=False,
#    bind=engine
#)

# Create tables
#Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

#app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def db():
    """Direct access to the SAME DB session used by FastAPI."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def client():
    return TestClient(app)

print(Base.metadata.tables.keys())


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import Base
from sqlalchemy.orm import Session

# ⭐ Import ALL models BEFORE create_all
import app.models

# (adjust to match your actual model files)

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    isolation_level="SERIALIZABLE"   # ⭐ This is the key line
)

# Now metadata contains all models
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

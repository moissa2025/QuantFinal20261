from app.db_base import Base
from sqlalchemy import (
    Column,
    String,
    Numeric,
    JSON,
    TIMESTAMP,
    ForeignKey,
    Integer,
    Boolean,
    CheckConstraint,
    UniqueConstraint,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
#from .db import Base
from sqlalchemy.orm import declarative_base

Base = declarative_base()

import uuid
from datetime import datetime, UTC


# -------------------------
# Asset Model
# -------------------------
class Asset(Base):
    __tablename__ = "assets"

    symbol = Column(String, primary_key=True)          # BTC, ETH, USDT, GBP
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)              # crypto or fiat
    precision = Column(Integer, nullable=False)
    chain = Column(String, nullable=False)             # bitcoin, ethereum, solana, none
    contract_address = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)


# -------------------------
# Account Model
# -------------------------
class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)                     # asset, liability, equity, revenue, expense
    user_id = Column(UUID(as_uuid=True), nullable=True)
    currency = Column(String, nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )

    # Relationships
    entries = relationship("JournalEntry", back_populates="account")


# -------------------------
# Transaction Model
# -------------------------
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)  # trade, deposit, withdrawal, transfer
    correlation_id = Column(String, nullable=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )

    # Relationship
    entries = relationship("JournalEntry", back_populates="transaction")


# -------------------------
# Journal Entry Model (UPDATED + HARDENED)
# -------------------------
class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    transaction_id = Column(
        UUID(as_uuid=True),
        ForeignKey("transactions.id", ondelete="RESTRICT"),
        nullable=False,
    )

    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("accounts.id", ondelete="RESTRICT"),
        nullable=False,
    )

    amount = Column(Numeric(18, 8), nullable=False)
    meta = Column(JSON, nullable=True)

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )

    # Relationships
    transaction = relationship("Transaction", back_populates="entries")
    account = relationship("Account", back_populates="entries")

    # Constraints + Indexes
    __table_args__ = (
        # Prevent invalid ledger entries
        CheckConstraint("amount IS NOT NULL", name="ck_journal_amount_not_null"),
        CheckConstraint("amount <> 0", name="ck_journal_amount_non_zero"),

        # Deterministic ordering guarantee
        UniqueConstraint(
            "account_id",
            "created_at",
            "id",
            name="uq_journal_account_created_id",
        ),

        # Composite index for pagination
        Index(
            "idx_journal_entry_account_created_id",
            "account_id",
            "created_at",
            "id",
        ),
    )


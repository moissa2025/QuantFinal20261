from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone as tz
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
    DateTime
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
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
    # NEW FIELD
    is_suspense = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
    entries = relationship("JournalEntry", back_populates="account")
    # Relationships
    entries = relationship("JournalEntry", back_populates="account")
#####Bank grade changed 
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)
    correlation_id = Column(String, nullable=True)

    # NEW: reversal linkage
    reversal_of_id = Column(
        UUID(as_uuid=True),
        ForeignKey("transactions.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(tz.utc),
    )

    entries = relationship("JournalEntry", back_populates="transaction")
    reversal_of = relationship("Transaction", remote_side=[id])

# New journal entry Model 
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

    # Business-level posting identifier (idempotency + audit)
    reference = Column(String, nullable=False, index=True)

    amount = Column(Numeric(18, 8), nullable=False)
    meta = Column(JSON, nullable=True)

    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )

    transaction = relationship("Transaction", back_populates="entries")
    account = relationship("Account", back_populates="entries")

    __table_args__ = (
        CheckConstraint("amount IS NOT NULL", name="ck_journal_amount_not_null"),
        CheckConstraint("amount <> 0", name="ck_journal_amount_non_zero"),
        UniqueConstraint(
            "account_id",
            "created_at",
            "id",
            name="uq_journal_account_created_id",
        ),
        Index(
            "idx_journal_entry_account_created_id",
            "account_id",
            "created_at",
            "id",
        ),
    )

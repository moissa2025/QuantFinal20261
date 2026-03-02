import app.db

from fastapi import FastAPI

from app.db_base import Base
from app.db import engine

# Routers
from app.routers import health
from app.routers import accounts
from app.routers import entries
from app.routers import balances
from app.routers import statements
from app.routers import journal
from app.routers import reversals
from app.routers import fx
from app.routers import (
    journal,
    trial_balance_per_currency,
    account_statements,
    posting_templates,
    bulk_posting_ingestion,
    audit_log_endpoints,
    ledger_snapshots,
    intraday_pnl,
    regulatory_reporting_hooks,
)
# ---------------------------------------------------------
# Create FastAPI app FIRST
# ---------------------------------------------------------
app = FastAPI(
    title="Ledger Service",
    version="1.0.0"
)


# ---------------------------------------------------------
# Startup: create tables
# ---------------------------------------------------------
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# Register routers AFTER app is created
# ---------------------------------------------------------
app.include_router(health.router)
app.include_router(accounts.router)
app.include_router(entries.router)
app.include_router(balances.router)
app.include_router(statements.router)
app.include_router(journal.router)
app.include_router(reversals.router)
app.include_router(fx.router)
app.include_router(trial_balance_per_currency.router)
app.include_router(account_statements.router)
app.include_router(posting_templates.router)
app.include_router(bulk_posting_ingestion.router)
app.include_router(audit_log_endpoints.router)
app.include_router(ledger_snapshots.router)
app.include_router(intraday_pnl.router)
app.include_router(regulatory_reporting_hooks.router)

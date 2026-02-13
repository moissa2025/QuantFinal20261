#import app.uuid_patch   # <-- must be first - test only cursor testing
from app.db import Base, engine
from app.routers import health
from app.routers import accounts
from app.routers import entries
from app.routers import transactions
from app.routers import balances
from app.routers import statements
from fastapi import FastAPI

app = FastAPI(
    title="Ledger Service",
    version="1.0.0"
)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
# Register routers
app.include_router(health.router)
app.include_router(accounts.router)
app.include_router(entries.router)
app.include_router(transactions.router)
app.include_router(balances.router)
app.include_router(statements.router)

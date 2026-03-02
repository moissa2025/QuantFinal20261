from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import onboarding

app = FastAPI(title="GlobalQuantX API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://globalquantx.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboarding.router)

@app.get("/health")
async def health():
    return {"status": "ok"}


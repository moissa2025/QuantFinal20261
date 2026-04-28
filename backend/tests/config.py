BASE = "http://localhost"  # or ingress base

SERVICES = {
    "auth": f"{BASE}:9001",
    "user": f"{BASE}:9002",
    "kyc": f"{BASE}:9003",
    "wallet": f"{BASE}:9004",
    "trading": f"{BASE}:9005",
    "risk": f"{BASE}:9006",
    "reconciliation": f"{BASE}:9007",
    "onboarding": f"{BASE}:9008",
    "intelligence": f"{BASE}:9009",
    "aml": f"{BASE}:9010",
    "ledger": f"{BASE}:9011",
    "api_gateway": f"{BASE}:8080",
    "market_data": f"{BASE}:9012",
}

DB = {
    "host": "cockroachdb-public.trading-platform.svc.cluster.local",
    "port": 26258,
    "user": "gqx_user",
    "password": "",
    "database": "gqx_db",
    "sslmode": "disable",
}

NATS = {
    "url": "nats://nats.trading-platform.svc.cluster.local:4222",
}

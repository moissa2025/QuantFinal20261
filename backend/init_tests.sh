#!/bin/bash
set -e

ROOT="tests"

mkdir -p $ROOT/services
mkdir -p $ROOT/schemas

touch $ROOT/__init__.py
touch $ROOT/services/__init__.py

cat > $ROOT/config.py << 'EOF'
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
EOF

cat > $ROOT/utils.py << 'EOF'
import requests
import psycopg2
import json
import time
from config import DB

def get(url, expected=200):
    r = requests.get(url)
    return validate(r, expected)

def post(url, payload, expected=200):
    r = requests.post(url, json=payload)
    return validate(r, expected)

def validate(response, expected):
    if response.status_code != expected:
        return False, {"status": response.status_code, "body": response.text}
    try:
        return True, response.json()
    except Exception:
        return True, response.text

def db_conn():
    conn = psycopg2.connect(
        host=DB["host"],
        port=DB["port"],
        user=DB["user"],
        password=DB["password"],
        dbname=DB["database"],
        sslmode=DB["sslmode"],
    )
    conn.autocommit = True
    return conn

def wait_for(condition_fn, timeout=10, interval=0.5):
    start = time.time()
    while time.time() - start < timeout:
        if condition_fn():
            return True
        time.sleep(interval)
    return False
EOF

cat > $ROOT/runner.py << 'EOF'
import importlib
import pkgutil
from typing import List, Tuple

def run_all_tests() -> List[Tuple[str, bool, object]]:
    results = []
    for _, module_name, _ in pkgutil.iter_modules(['tests/services']):
        module = importlib.import_module(f"tests.services.{module_name}")
        for name in dir(module):
            if name.startswith("test_"):
                fn = getattr(module, name)
                test_name, ok, data = fn()
                results.append((test_name, ok, data))
    return results

if __name__ == "__main__":
    results = run_all_tests()
    print("\n=== TEST RESULTS ===")
    for name, ok, data in results:
        status = "PASS" if ok else "FAIL"
        print(f"{name:40} {status}")
        if not ok:
            print(f"  → {data}")
EOF

echo "Scaffold created under tests/"


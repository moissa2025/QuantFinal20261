import requests

def check(url):
    try:
        r = requests.get(url, timeout=5)
        return r.status_code == 200
    except:
        return False

def main():
    base = "http://localhost:8080"

    endpoints = [
        "/health",
        "/v1/auth/health",
        "/v1/users/health",
        "/v1/wallet/health",
        "/v1/market/health",
        "/v1/orders/health",
        "/v1/positions/health",
        "/v1/trading/health",
        "/v1/risk/health",
        "/v1/ledger/health",
        "/v1/balances/health",
        "/v1/intelligence/health",
    ]

    all_ok = True

    for ep in endpoints:
        url = base + ep
        ok = check(url)
        print(f"{url:50} {'OK' if ok else 'FAIL'}")
        if not ok:
            all_ok = False

    return all_ok

if __name__ == "__main__":
    print("PASS" if main() else "FAIL")


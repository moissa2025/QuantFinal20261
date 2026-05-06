from .utils import api

def create_wallet(token):
    status, data = api("POST", "/wallet/create", headers={
        "Authorization": f"Bearer {token}"
    })
    assert status == 201
    return data["wallet_id"]

def link_binance(token, api_key, api_secret):
    status, _ = api("POST", "/wallet/binance/link", {
        "api_key": api_key,
        "api_secret": api_secret
    }, headers={"Authorization": f"Bearer {token}"})
    assert status == 200

def validate_balance(token):
    status, data = api("GET", "/wallet/balance/validate", headers={
        "Authorization": f"Bearer {token}"
    })
    assert status == 200
    assert data["status"] == "match"

def test_wallet_journey(token):
    wallet_id = create_wallet(token)
    link_binance(token, "BINANCE_KEY", "BINANCE_SECRET")
    validate_balance(token)
    print("Wallet journey OK")


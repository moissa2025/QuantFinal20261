from .utils import api

def buy_eth(token):
    status, data = api("POST", "/trading/order", {
        "symbol": "ETHUSDT",
        "side": "BUY",
        "qty": 0.01
    }, headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    return data["order_id"]

def test_trading_journey(token):
    order_id = buy_eth(token)
    print("Trading journey OK")


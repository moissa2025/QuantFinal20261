from .utils import api

def test_ledger_journey(token):
    status, data = api("GET", "/ledger/entries", headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    print("Ledger journey OK")


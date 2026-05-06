from .utils import api

def test_reconciliation_journey(token):
    status, data = api("GET", "/reconciliation/run", headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    print("Reconciliation journey OK")


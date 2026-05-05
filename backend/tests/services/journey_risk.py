from services.utils import api

def test_risk_journey(token):
    status, data = api("GET", "/risk/exposure", headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    print("Risk journey OK")


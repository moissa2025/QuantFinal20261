from services.utils import api

def test_kyc_journey(token):
    status, _ = api("POST", "/kyc/start", headers={"Authorization": f"Bearer {token}"})
    assert status == 200

    status, _ = api("POST", "/kyc/upload", {
        "document_type": "passport",
        "document_id": "TEST123"
    }, headers={"Authorization": f"Bearer {token}"})
    assert status == 200

    status, data = api("GET", "/kyc/status", headers={"Authorization": f"Bearer {token}"})
    assert status == 200
    assert data["status"] in ["approved", "pending"]

    print("KYC journey OK")


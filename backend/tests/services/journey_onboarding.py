from services.utils import api

def test_onboarding_journey(token):
    status, _ = api("POST", "/onboarding/start", headers={"Authorization": f"Bearer {token}"})
    assert status == 200

    status, _ = api("POST", "/onboarding/complete", headers={"Authorization": f"Bearer {token}"})
    assert status == 200

    print("Onboarding journey OK")


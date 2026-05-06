from .utils import api
from ..config import EMAIL

def user_register():
    status, data = api("POST", "/identity/register", {
        "email": EMAIL,
        "password": "Test1234!",
        "full_name": "Test User"
    })
    assert status == 201
    return data["user_id"]

def user_activate():
    status, data = api("POST", "/identity/activate", {
        "email": EMAIL,
        "otac": "000000"   # test OTAC from provider sandbox
    })
    assert status == 200

def user_login():
    status, data = api("POST", "/identity/login", {
        "email": EMAIL,
        "password": "Test1234!"
    })
    assert status == 200
    return data["access_token"], data["refresh_token"]

def user_logout(token):
    status, _ = api("POST", "/identity/logout", headers={
        "Authorization": f"Bearer {token}"
    })
    assert status == 200

def test_user_journey():
    user_id = user_register()
    user_activate()
    access, refresh = user_login()
    user_logout(access)
    print("User journey OK")


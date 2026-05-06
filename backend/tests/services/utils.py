import requests
from ..config import API_GATEWAY

def api(method, path, json=None, headers=None):
    url = f"{API_GATEWAY}{path}"
    r = requests.request(method, url, json=json, headers=headers)
    return r.status_code, (r.json() if r.content else {})


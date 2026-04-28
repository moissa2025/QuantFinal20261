import concurrent.futures
from config import SERVICES
from utils import get

def _hit_health(_):
    ok, _data = get(f"{SERVICES['api_gateway']}/health")
    return ok

def test_basic_load():
    N = 1000
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as ex:
        results = list(ex.map(_hit_health, range(N)))
    ok = all(results)
    return ("load.api_gateway_health_1000", ok, f"success={sum(results)}/{N}")


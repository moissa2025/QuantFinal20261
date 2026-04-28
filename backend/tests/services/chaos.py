import subprocess
import time
from config import SERVICES
from utils import get, db_conn

NAMESPACE = "trading-platform"

def _kubectl(args):
    return subprocess.run(["kubectl"] + args, check=False, capture_output=True, text=True)

def test_chaos_kill_pods_and_recover():
    # Kill all trading-service pods
    _kubectl(["delete", "pod", "-n", NAMESPACE, "-l", "app=trading-service"])
    time.sleep(5)

    # Check API gateway still responds
    ok, _ = get(f"{SERVICES['api_gateway']}/health")
    if not ok:
        return ("chaos.kill_trading_pods", False, "api-gateway unhealthy after trading kill")

    # Wait for trading-service to come back
    time.sleep(10)
    pods = _kubectl(["get", "pods", "-n", NAMESPACE, "-l", "app=trading-service"]).stdout
    recovered = "Running" in pods
    return ("chaos.kill_trading_pods_recover", recovered, pods)


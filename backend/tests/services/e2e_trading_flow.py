from config import SERVICES
from utils import get, post, db_conn, wait_for

def test_e2e_trading_flow():
    steps = []

    # 1) Register
    payload = {"email": "e2e@test.com", "password": "Pass123!"}
    ok, data = post(f"{SERVICES['auth']}/register", payload, expected=201)
    steps.append(("auth.register", ok, data))
    if not ok:
        return ("e2e.register", False, steps)

    # 2) Login
    ok, data = post(f"{SERVICES['auth']}/login", payload, expected=200)
    steps.append(("auth.login", ok, data))
    if not ok:
        return ("e2e.login", False, steps)
    token = data.get("token")

    headers = {"Authorization": f"Bearer {token}"}

    # 3) Create user profile
    ok, data = post(f"{SERVICES['user']}/profile", {"name": "E2E User"}, expected=201)
    steps.append(("user.profile", ok, data))
    if not ok:
        return ("e2e.user_profile", False, steps)

    # 4) Deposit
    ok, data = post(f"{SERVICES['wallet']}/deposit", {"amount": 10000, "currency": "USD"}, expected=200)
    steps.append(("wallet.deposit", ok, data))
    if not ok:
        return ("e2e.deposit", False, steps)

    # 5) Place trade
    trade_req = {"symbol": "AAPL", "side": "BUY", "qty": 10, "price": 150}
    ok, data = post(f"{SERVICES['trading']}/orders", trade_req, expected=201)
    steps.append(("trading.order", ok, data))
    if not ok:
        return ("e2e.trade", False, steps)
    order_id = data.get("order_id")

    # 6) Wait for settlement + reconciliation in DB
    conn = db_conn()
    cur = conn.cursor()

    def trade_settled():
        cur.execute("SELECT status FROM trades WHERE id = %s", (order_id,))
        row = cur.fetchone()
        return row and row[0] == "SETTLED"

    settled = wait_for(trade_settled, timeout=20)
    steps.append(("db.trade_settled", settled, None))
    if not settled:
        return ("e2e.settle", False, steps)

    def reconciled():
        cur.execute("SELECT status FROM reconciliations WHERE trade_id = %s", (order_id,))
        row = cur.fetchone()
        return row and row[0] == "COMPLETED"

    rec_ok = wait_for(reconciled, timeout=20)
    steps.append(("db.reconciled", rec_ok, None))

    overall = all(s[1] for s in steps)
    return ("e2e.full_trading_flow", overall, steps)


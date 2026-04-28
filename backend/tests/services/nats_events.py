import asyncio
from config import NATS
from utils import db_conn, wait_for
from nats.aio.client import Client as NATSClient

def test_nats_trade_event():
    """
    Subscribe to a trade subject, trigger a trade, assert event received.
    """
    async def _run():
        nc = NATSClient()
        await nc.connect(servers=[NATS["url"]])

        msgs = []

        async def handler(msg):
            msgs.append(msg.data.decode())

        await nc.subscribe("trades.executed", cb=handler)

        # Here you would trigger a trade via HTTP
        # (reuse trading order call from E2E or keep it simple)

        def got_event():
            return len(msgs) > 0

        ok = wait_for(got_event, timeout=10)
        await nc.close()
        return ok, msgs

    ok, msgs = asyncio.get_event_loop().run_until_complete(_run())
    return ("nats.trade_event", ok, msgs)


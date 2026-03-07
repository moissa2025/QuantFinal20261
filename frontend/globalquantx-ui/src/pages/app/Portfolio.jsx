import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getBalances } from "../../api/ledger";
import { getOpenOrders } from "../../api/trading";

export default function Portfolio() {
  const [balances, setBalances] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getBalances().then(setBalances).catch(console.error);
    getOpenOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <Page title="Portfolio">
      <section>
        <h2>Balances</h2>
        <ul>
          {balances.map((b) => (
            <li key={b.asset}>{b.asset}: {b.amount}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Open Orders</h2>
        <ul>
          {orders.map((o) => (
            <li key={o.id}>{o.symbol} — {o.side} {o.size}</li>
          ))}
        </ul>
      </section>
    </Page>
  );
}


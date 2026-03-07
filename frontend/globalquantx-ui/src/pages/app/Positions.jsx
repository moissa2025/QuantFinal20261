import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getOpenOrders } from "../../api/trading";

export default function Positions() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOpenOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <Page title="Open Positions">
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.symbol} — {o.side} {o.size}
          </li>
        ))}
      </ul>
    </Page>
  );
}


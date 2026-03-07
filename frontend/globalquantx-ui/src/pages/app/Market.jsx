import { useEffect, useState } from "react";
import Page from "../../components/layout/Page";
import { getTickers } from "../../api/market";
import { connectMarketStream } from "../../api/marketSocket";

export default function Market() {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    getTickers().then(setTickers).catch(console.error);

    const ws = connectMarketStream((update) => {
      setTickers((prev) =>
        prev.map((t) => (t.symbol === update.symbol ? update : t))
      );
    });

    return () => ws.close();
  }, []);

  return (
    <Page title="Market Data">
      <ul>
        {tickers.map((t) => (
          <li key={t.symbol}>
            {t.symbol}: {t.price}
          </li>
        ))}
      </ul>
    </Page>
  );
}


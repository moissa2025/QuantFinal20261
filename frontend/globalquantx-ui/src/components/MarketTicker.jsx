import React, { useEffect, useState } from "react";
import "../styles/layout.css";

const INITIAL_ITEMS = [
  { symbol: "BTC/USD", key: "BTCUSDT", price: 68420, change: 2.4 },
  { symbol: "ETH/USD", key: "ETHUSDT", price: 3240, change: -1.2 },
  { symbol: "AAPL", key: "AAPL", price: 192.14, change: 0.8 },
  { symbol: "EUR/USD", key: "EURUSD", price: 1.083, change: 0.1 },
  { symbol: "QQQ", key: "QQQ", price: 441.22, change: -0.5 },
];

export default function MarketTicker() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [flashes, setFlashes] = useState({});

  // Optional WebSocket feed (example: Binance for BTC/ETH)
  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!Array.isArray(data)) return;

        setItems((prev) =>
          prev.map((item) => {
            if (item.key === "BTCUSDT" || item.key === "ETHUSDT") {
              const match = data.find((d) => d.s === item.key);
              if (!match) return item;

              const newPrice = parseFloat(match.c);
              const oldPrice = item.price;
              if (!newPrice || newPrice === oldPrice) return item;

              const newChange = parseFloat(match.P); // % change

              setFlashes((prevFlashes) => ({
                ...prevFlashes,
                [item.symbol]: newPrice > oldPrice ? "up" : "down",
              }));

              setTimeout(() => {
                setFlashes((prevFlashes) => ({
                  ...prevFlashes,
                  [item.symbol]: null,
                }));
              }, 600);

              return {
                ...item,
                price: newPrice,
                change: newChange,
              };
            }
            return item;
          })
        );
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      // if WS fails, we just keep static data
    };

    return () => ws.close();
  }, []);

  const renderItems = (loopIndex) =>
    items.map((item, i) => {
      const isUp = item.change >= 0;
      const flashClass =
        flashes[item.symbol] === "up"
          ? "gqx-ticker-flash-up"
          : flashes[item.symbol] === "down"
          ? "gqx-ticker-flash-down"
          : "";

      return (
        <span
          key={`${loopIndex}-${item.symbol}-${i}`}
          className={`gqx-ticker-item ${flashClass}`}
        >
          {item.symbol} — {item.price.toLocaleString(undefined, {
            maximumFractionDigits: 3,
          })}{" "}
          <span className={isUp ? "gqx-ticker-up" : "gqx-ticker-down"}>
            {item.change > 0 ? `+${item.change.toFixed(1)}%` : `${item.change.toFixed(1)}%`}
          </span>
        </span>
      );
    });

  return (
    <div className="gqx-ticker">
      <div className="gqx-ticker-track">
        {renderItems(0)}
        {renderItems(1)}
      </div>
    </div>
  );
}


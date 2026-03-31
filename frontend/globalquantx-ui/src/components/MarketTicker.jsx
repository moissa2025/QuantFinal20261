import React from "react";

export default function MarketTicker() {
  const items = [
    { symbol: "BTC/USD", price: "68,420", change: "+2.4%" },
    { symbol: "ETH/USD", price: "3,240", change: "-1.2%" },
    { symbol: "AAPL", price: "192.14", change: "+0.8%" },
    { symbol: "EUR/USD", price: "1.083", change: "+0.1%" },
    { symbol: "QQQ", price: "441.22", change: "-0.5%" },
  ];

  return (
    <div className="gqx-ticker">
      <div className="gqx-ticker-track">
        {items.concat(items).map((item, i) => (
          <span key={i} className="gqx-ticker-item">
            {item.symbol} — {item.price}{" "}
            <span className={item.change.startsWith("+") ? "gqx-ticker-up" : "gqx-ticker-down"}>
              {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}


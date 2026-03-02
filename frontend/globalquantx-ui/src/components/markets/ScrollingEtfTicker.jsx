import React from "react";

const etfs = [
  { symbol: "EEM", price: 41.32, changePct: -0.07 },
  { symbol: "XLK", price: 210.55, changePct: 0.03 },
  { symbol: "XLF", price: 39.12, changePct: -0.02 },
  { symbol: "XLV", price: 142.88, changePct: 0.22 },
  { symbol: "XLE", price: 89.21, changePct: 0.04 },
  { symbol: "HYG", price: 76.32, changePct: -0.11 },
  { symbol: "LQD", price: 108.45, changePct: 0.01 },
];

const ScrollingEtfTicker = () => {
  return (
    <div className="card">
      <div className="card-title">TOP 20 ETFs</div>
      <div className="etf-ticker-strip">
        {etfs.map((m) => (
          <div key={m.symbol} style={{ display: "flex", gap: "6px" }}>
            <span>{m.symbol}</span>
            <span>{m.price}</span>
            <span style={{ color: m.changePct >= 0 ? "#00e58a" : "#ff4d6a" }}>
              {m.changePct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingEtfTicker;


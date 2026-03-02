import React from "react";

const CRYPTOS = [
  { symbol: "BTC/USDT", price: "42,358.82", currency: "USDT", change: "+0.24" },
  { symbol: "ETH/USDT", price: "2,315.55", currency: "USDT", change: "-0.12" },
  { symbol: "SOL/USDT", price: "98.22", currency: "USDT", change: "+1.02" },
  { symbol: "XRP/USDT", price: "0.62", currency: "USDT", change: "+0.18" },
  { symbol: "LINK/USDT", price: "17.45", currency: "USDT", change: "-0.08" },
  { symbol: "AVAX/USDT", price: "38.12", currency: "USDT", change: "+0.41" },
  { symbol: "DOGE/USDT", price: "0.087", currency: "USDT", change: "+0.05" },
  { symbol: "MATIC/USDT", price: "0.92", currency: "USDT", change: "-0.21" },
  { symbol: "ARB/USDT", price: "1.32", currency: "USDT", change: "+0.33" },
  { symbol: "OP/USDT", price: "3.15", currency: "USDT", change: "-0.14" },
];

const CryptoList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Top 10 Crypto</div>
          <div className="card-sub">High‑liquidity pairs, simulated pricing</div>
        </div>
      </div>

      <div className="instrument-list">
        <div className="instrument-row instrument-row-header">
          <div>Pair</div>
          <div>Last price</div>
          <div>24h change</div>
        </div>
        {CRYPTOS.map((c) => {
          const isUp = c.change.startsWith("+");
          return (
            <div className="instrument-row" key={c.symbol}>
              <div className="instrument-symbol">{c.symbol}</div>
              <div className="instrument-price">
                {c.price}
                <span>{c.currency}</span>
              </div>
              <div className={`instrument-change ${isUp ? "up" : "down"}`}>
                {c.change}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoList;


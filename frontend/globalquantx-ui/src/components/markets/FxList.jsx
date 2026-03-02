import React from "react";

const FX_PAIRS = [
  { symbol: "EUR/USD", price: "1.0836", currency: "USD", change: "-0.04" },
  { symbol: "GBP/USD", price: "1.2722", currency: "USD", change: "+0.03" },
  { symbol: "USD/JPY", price: "147.32", currency: "JPY", change: "+0.12" },
  { symbol: "AUD/USD", price: "0.6621", currency: "USD", change: "-0.02" },
  { symbol: "USD/CHF", price: "0.8765", currency: "CHF", change: "+0.01" },
  { symbol: "USD/CAD", price: "1.3412", currency: "CAD", change: "-0.05" },
  { symbol: "EUR/GBP", price: "0.8521", currency: "GBP", change: "+0.02" },
  { symbol: "EUR/JPY", price: "159.12", currency: "JPY", change: "-0.07" },
  { symbol: "GBP/JPY", price: "187.45", currency: "JPY", change: "+0.09" },
  { symbol: "NZD/USD", price: "0.6123", currency: "USD", change: "-0.03" },
];

const FxList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Top 10 FX</div>
          <div className="card-sub">G10 majors, simulated ECN pricing</div>
        </div>
      </div>

      <div className="instrument-list">
        <div className="instrument-row instrument-row-header">
          <div>Pair</div>
          <div>Last price</div>
          <div>24h change</div>
        </div>
        {FX_PAIRS.map((p) => {
          const isUp = p.change.startsWith("+");
          return (
            <div className="instrument-row" key={p.symbol}>
              <div className="instrument-symbol">{p.symbol}</div>
              <div className="instrument-price">
                {p.price}
                <span>{p.currency}</span>
              </div>
              <div className={`instrument-change ${isUp ? "up" : "down"}`}>
                {p.change}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FxList;


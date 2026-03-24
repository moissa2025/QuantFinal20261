import { useState } from "react";

export default function ArbitrageRadar() {
  const [symbol, setSymbol] = useState("BTCUSD");

  return (
    <div className="ar-container">

      <div className="ar-header">
        <h1>Cross‑Venue Arbitrage Radar</h1>
        <p>Detect price spreads, mispricing, and arbitrage windows.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="ar-panel">
        <h2>Select Market</h2>

        <select className="ar-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>
      </div>

      {/* PRICES */}
      <div className="ar-panel">
        <h2>Venue Prices</h2>

        <pre className="ar-block">
{`Venue A   68210
Venue B   68218
Venue C   68204`}
        </pre>
      </div>

      {/* ARB WINDOW */}
      <div className="ar-panel">
        <h2>Arbitrage Window</h2>

        <pre className="ar-block">
{`Buy:  Venue C @ 68204
Sell: Venue B @ 68218

Spread: $14
Latency‑Adj Profit: $9`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ar-panel">
        <h2>Arbitrage Event Log</h2>

        <ul className="ar-log">
          <li>Spread detected</li>
          <li>Latency adjustment applied</li>
          <li>Arb opportunity computed</li>
        </ul>
      </div>

    </div>
  );
}


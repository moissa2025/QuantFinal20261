import { useState } from "react";

export default function TrendEngine() {
  const [asset, setAsset] = useState("BTC");

  return (
    <div className="te-container">

      <div className="te-header">
        <h1>Multi‑Asset Trend Engine</h1>
        <p>Trend signals, regimes, and diagnostics.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="te-panel">
        <h2>Select Asset</h2>

        <select className="te-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>Gold</option>
          <option>SP500</option>
        </select>
      </div>

      {/* SIGNAL */}
      <div className="te-panel">
        <h2>Trend Signal</h2>

        <pre className="te-block">
{`Signal: Uptrend
Strength: 68%
Momentum: Rising`}
        </pre>
      </div>

      {/* TREND CURVE */}
      <div className="te-panel">
        <h2>Trend Curve</h2>

        <pre className="te-block">
{`Trend
────────────────────────
1d     ████
7d     ████████
30d    ███████████████
90d    ███████████████████████`}
        </pre>
      </div>

      {/* DIAGNOSTICS */}
      <div className="te-panel">
        <h2>Trend Diagnostics</h2>

        <pre className="te-block">
{`Regime: Trending
Volatility: Moderate
Signal Stability: High`}
        </pre>
      </div>

      {/* LOG */}
      <div className="te-panel">
        <h2>Trend Log</h2>

        <ul className="te-log">
          <li>Signal computed</li>
          <li>Trend curve generated</li>
          <li>Regime classified</li>
        </ul>
      </div>

    </div>
  );
}


import { useState } from "react";

export default function VolSurface() {
  const [symbol, setSymbol] = useState("BTC");

  return (
    <div className="vs-container">

      <div className="vs-header">
        <h1>Options Vol Surface & Smile Lab</h1>
        <p>Vol surfaces, smiles, skews, and term structure analytics.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="vs-panel">
        <h2>Select Underlying</h2>

        <select className="vs-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>
      </div>

      {/* VOL SURFACE */}
      <div className="vs-panel">
        <h2>Volatility Surface</h2>

        <pre className="vs-surface">
{`Strike ↓  |  Expiry →
           7d     30d     90d
0.8K       82%     76%     68%
1.0K       74%     70%     63%
1.2K       78%     72%     65%`}
        </pre>
      </div>

      {/* VOL SMILE */}
      <div className="vs-panel">
        <h2>Vol Smile (30d)</h2>

        <pre className="vs-smile">
{`Strike    IV
────────────────
0.8K      82%
0.9K      76%
1.0K      70%
1.1K      72%
1.2K      78%`}
        </pre>
      </div>

      {/* TERM STRUCTURE */}
      <div className="vs-panel">
        <h2>Term Structure</h2>

        <pre className="vs-term">
{`Expiry    IV
────────────────
7d        74%
30d       70%
90d       63%`}
        </pre>
      </div>

      {/* ANOMALIES */}
      <div className="vs-panel">
        <h2>Surface Anomalies</h2>

        <ul className="vs-log">
          <li><strong>21:10:44</strong> — Smile inversion detected</li>
          <li><strong>18:44:12</strong> — Term structure kink at 30d</li>
        </ul>
      </div>

    </div>
  );
}


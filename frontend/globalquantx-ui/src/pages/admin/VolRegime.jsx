import { useState } from "react";

export default function VolRegime() {
  const [asset, setAsset] = useState("BTC");

  return (
    <div className="vr-container">

      <div className="vr-header">
        <h1>Multi‑Asset Volatility Regime Engine</h1>
        <p>Vol clustering, regime detection, and cross‑asset vol states.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="vr-panel">
        <h2>Select Asset</h2>

        <select className="vr-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>
      </div>

      {/* VOL LEVELS */}
      <div className="vr-panel">
        <h2>Volatility Levels</h2>

        <pre className="vr-block">
{`Realized Vol:     62%
Implied Vol:       70%
Vol-of-Vol:        18%`}
        </pre>
      </div>

      {/* REGIME */}
      <div className="vr-panel">
        <h2>Current Regime</h2>

        <pre className="vr-block">
{`Regime: High-Vol Expansion
Confidence: 82%`}
        </pre>
      </div>

      {/* REGIME TIMELINE */}
      <div className="vr-panel">
        <h2>Regime Timeline</h2>

        <pre className="vr-block">
{`Past 30 Days
────────────────────────
Low-Vol     ████
Choppy                 ███
High-Vol                     ███████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="vr-panel">
        <h2>Vol Regime Log</h2>

        <ul className="vr-log">
          <li>Vol spike detected</li>
          <li>Regime shifted to High-Vol</li>
          <li>Vol-of-vol elevated</li>
        </ul>
      </div>

    </div>
  );
}


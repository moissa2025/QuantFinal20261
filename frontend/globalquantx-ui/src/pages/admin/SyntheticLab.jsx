import { useState } from "react";

export default function SyntheticLab() {
  const [symbol, setSymbol] = useState("BTC");

  return (
    <div className="sl-container">

      <div className="sl-header">
        <h1>Synthetic Instruments Lab</h1>
        <p>Perp vs spot vs futures pricing, basis, and synthetic replication.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="sl-panel">
        <h2>Select Underlying</h2>

        <select className="sl-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>
      </div>

      {/* PRICES */}
      <div className="sl-panel">
        <h2>Instrument Prices</h2>

        <pre className="sl-block">
{`Spot       68200
Perp       68214
Futures    68320 (30d)`}
        </pre>
      </div>

      {/* BASIS */}
      <div className="sl-panel">
        <h2>Basis & Fair Value</h2>

        <pre className="sl-block">
{`Basis (Perp - Spot):        +14
Futures Basis (30d):         +120
Annualized Basis:            6.4%
Synthetic Fair Value:        68208`}
        </pre>
      </div>

      {/* SYNTHETIC REPLICATION */}
      <div className="sl-panel">
        <h2>Synthetic Replication</h2>

        <pre className="sl-block">
{`Long Perp + Short Futures (30d)
Carry: +0.42%
Funding Impact: +0.012%`}
        </pre>
      </div>

      {/* LOG */}
      <div className="sl-panel">
        <h2>Lab Event Log</h2>

        <ul className="sl-log">
          <li>Prices loaded</li>
          <li>Basis computed</li>
          <li>Synthetic replication evaluated</li>
        </ul>
      </div>

    </div>
  );
}


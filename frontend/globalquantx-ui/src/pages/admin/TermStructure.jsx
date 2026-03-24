import { useState } from "react";

export default function TermStructure() {
  const [asset, setAsset] = useState("BTC");

  return (
    <div className="ts-container">

      <div className="ts-header">
        <h1>Multi‑Asset Term Structure Engine</h1>
        <p>Contango, backwardation, roll yield, and curve diagnostics.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="ts-panel">
        <h2>Select Asset</h2>

        <select className="ts-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>Oil</option>
          <option>Gold</option>
        </select>
      </div>

      {/* CURVE */}
      <div className="ts-panel">
        <h2>Term Structure</h2>

        <pre className="ts-block">
{`1M     +1.2%
3M     +2.4%
6M     +3.1%
12M    +4.0%`}
        </pre>
      </div>

      {/* DIAGNOSTICS */}
      <div className="ts-panel">
        <h2>Curve Diagnostics</h2>

        <pre className="ts-block">
{`Regime: Contango
Steepness: High
Roll Yield: +1.8%`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="ts-panel">
        <h2>Term Structure Heatmap</h2>

        <pre className="ts-block">
{`Contango:          ████████████████
Backwardation:      ████
Roll Yield:         █████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ts-panel">
        <h2>Term Structure Log</h2>

        <ul className="ts-log">
          <li>Curve loaded</li>
          <li>Regime classified</li>
          <li>Roll yield computed</li>
        </ul>
      </div>

    </div>
  );
}


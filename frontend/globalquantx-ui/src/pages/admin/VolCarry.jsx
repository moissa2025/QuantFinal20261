import { useState } from "react";

export default function VolCarry() {
  const [asset, setAsset] = useState("BTC");

  return (
    <div className="vc-container">

      <div className="vc-header">
        <h1>Multi‑Asset Vol‑Carry Engine</h1>
        <p>Volatility carry, term structure roll, and VRP diagnostics.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="vc-panel">
        <h2>Select Asset</h2>

        <select className="vc-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>
      </div>

      {/* VOL CARRY */}
      <div className="vc-panel">
        <h2>Vol‑Carry Metrics</h2>

        <pre className="vc-block">
{asset === "BTC" && `IV (30d):        70%
RV (30d):        62%
Vol‑Carry:       +8%`}

{asset === "ETH" && `IV (30d):        64%
RV (30d):        58%
Vol‑Carry:       +6%`}

{asset === "SOL" && `IV (30d):        82%
RV (30d):        74%
Vol‑Carry:       +8%`}
        </pre>
      </div>

      {/* TERM STRUCTURE */}
      <div className="vc-panel">
        <h2>Term Structure Roll</h2>

        <pre className="vc-block">
{`7d → 30d:     +4%
30d → 90d:     +2%
90d → 180d:    +1%`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="vc-panel">
        <h2>Vol‑Carry Heatmap</h2>

        <pre className="vc-block">
{`Positive VRP:     ████████████████
Negative VRP:     ████
Roll Yield:       █████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="vc-panel">
        <h2>Vol‑Carry Log</h2>

        <ul className="vc-log">
          <li>IV/RV spread computed</li>
          <li>Term structure roll calculated</li>
          <li>VRP signal generated</li>
        </ul>
      </div>

    </div>
  );
}


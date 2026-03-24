import { useState } from "react";

export default function CarryEngine() {
  const [asset, setAsset] = useState("FX");

  return (
    <div className="ce-container">

      <div className="ce-header">
        <h1>Multi‑Asset Carry Engine</h1>
        <p>FX carry, rates carry, commodity roll yield, and diagnostics.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="ce-panel">
        <h2>Select Asset Class</h2>

        <select className="ce-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option value="FX">FX</option>
          <option value="Rates">Rates</option>
          <option value="Commodities">Commodities</option>
        </select>
      </div>

      {/* CARRY DATA */}
      <div className="ce-panel">
        <h2>Carry Metrics</h2>

        <pre className="ce-block">
{asset === "FX" && `USDJPY Carry:       +3.2%
AUDUSD Carry:       +1.8%
EURUSD Carry:       -0.4%`}

{asset === "Rates" && `US 2Y Carry:       +2.1%
UK 2Y Carry:       +1.4%
DE 2Y Carry:       +0.8%`}

{asset === "Commodities" && `Oil Roll Yield:    -1.2%
Gold Roll Yield:   +0.4%
Copper Roll Yield: +0.8%`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="ce-panel">
        <h2>Carry Heatmap</h2>

        <pre className="ce-block">
{`Positive Carry:     ████████████████
Negative Carry:     ████
Roll Yield:         ███████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ce-panel">
        <h2>Carry Engine Log</h2>

        <ul className="ce-log">
          <li>Carry metrics updated</li>
          <li>Roll yield computed</li>
          <li>Carry heatmap generated</li>
        </ul>
      </div>

    </div>
  );
}


import { useState } from "react";

export default function CrossAsset() {
  const [asset, setAsset] = useState("FX");

  return (
    <div className="ca4-container">

      <div className="ca4-header">
        <h1>Global Cross‑Asset Dashboard</h1>
        <p>FX, rates, credit, commodities, and cross‑asset diagnostics.</p>
      </div>

      {/* SELECTOR */}
      <div className="ca4-panel">
        <h2>Select Asset Class</h2>

        <select className="ca4-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option value="FX">FX</option>
          <option value="Rates">Rates</option>
          <option value="Credit">Credit</option>
          <option value="Commodities">Commodities</option>
        </select>
      </div>

      {/* DATA */}
      <div className="ca4-panel">
        <h2>Market Data</h2>

        <pre className="ca4-block">
{asset === "FX" && `EURUSD   1.0820
GBPUSD   1.2640
USDJPY   151.20`}

{asset === "Rates" && `US 10Y     4.10%
UK 10Y     3.85%
DE 10Y     2.42%`}

{asset === "Credit" && `US IG Spreads      112 bps
US HY Spreads      398 bps
EU IG Spreads      128 bps`}

{asset === "Commodities" && `Gold       2140
Oil (WTI)   78.4
Copper      4.12`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="ca4-panel">
        <h2>Cross‑Asset Heatmap</h2>

        <pre className="ca4-block">
{`FX Vol:            ███████████
Rates Vol:          █████████████████
Credit Stress:      ███████
Commodity Momentum: ████████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ca4-panel">
        <h2>Cross‑Asset Event Log</h2>

        <ul className="ca4-log">
          <li>Rates volatility spike</li>
          <li>Credit spreads widening</li>
          <li>FX carry flows rising</li>
        </ul>
      </div>

    </div>
  );
}


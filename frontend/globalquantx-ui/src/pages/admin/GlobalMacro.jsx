import { useState } from "react";

export default function GlobalMacro() {
  const [asset, setAsset] = useState("FX");

  return (
    <div className="gm-container">

      <div className="gm-header">
        <h1>Global Macro Dashboard</h1>
        <p>FX, rates, commodities, and macro indicators.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="gm-panel">
        <h2>Select Asset Class</h2>

        <select className="gm-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option value="FX">FX</option>
          <option value="Rates">Rates</option>
          <option value="Commodities">Commodities</option>
        </select>
      </div>

      {/* DATA */}
      <div className="gm-panel">
        <h2>Market Data</h2>

        <pre className="gm-block">
{asset === "FX" && `EURUSD   1.0820
GBPUSD   1.2640
USDJPY   151.20`}

{asset === "Rates" && `US 10Y     4.10%
UK 10Y     3.85%
DE 10Y     2.42%`}

{asset === "Commodities" && `Gold       2140
Oil (WTI)   78.4
Copper      4.12`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="gm-panel">
        <h2>Macro Heatmap</h2>

        <pre className="gm-block">
{`Growth:        ███████████
Inflation:      ███████
Liquidity:       ████████████████
Risk Appetite:   █████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="gm-panel">
        <h2>Macro Event Log</h2>

        <ul className="gm-log">
          <li>US CPI surprise</li>
          <li>BoE rate commentary</li>
          <li>Oil supply shock</li>
        </ul>
      </div>

    </div>
  );
}


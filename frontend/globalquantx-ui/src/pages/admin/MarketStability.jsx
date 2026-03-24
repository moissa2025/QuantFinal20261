import { useState } from "react";

export default function MarketStability() {
  const [regime, setRegime] = useState("stable");

  return (
    <div className="ms-container">

      <div className="ms-header">
        <h1>Market Stability Monitor</h1>
        <p>Fragility, stress, volatility shocks, and systemic risk.</p>
      </div>

      {/* REGIME SELECTOR */}
      <div className="ms-panel">
        <h2>Current Regime</h2>

        <select className="ms-select" value={regime} onChange={(e) => setRegime(e.target.value)}>
          <option value="stable">Stable</option>
          <option value="fragile">Fragile</option>
          <option value="stressed">Stressed</option>
        </select>
      </div>

      {/* INDICATORS */}
      <div className="ms-panel">
        <h2>Stability Indicators</h2>

        <pre className="ms-block">
{`Liquidity Stress:     42%
Volatility Stress:     61%
Systemic Risk:         28%`}
        </pre>
      </div>

      {/* FRAGILITY */}
      <div className="ms-panel">
        <h2>Fragility Map</h2>

        <pre className="ms-block">
{`BTC     ███████████
ETH     ████████
SOL     █████████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ms-panel">
        <h2>Stability Event Log</h2>

        <ul className="ms-log">
          <li>Liquidity stress elevated</li>
          <li>Volatility shock detected</li>
          <li>Systemic risk rising</li>
        </ul>
      </div>

    </div>
  );
}


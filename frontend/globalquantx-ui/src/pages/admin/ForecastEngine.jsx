import { useState } from "react";

export default function ForecastEngine() {
  const [horizon, setHorizon] = useState("short");

  return (
    <div className="fe-container">

      <div className="fe-header">
        <h1>Multi‑Horizon Forecast Engine</h1>
        <p>Short‑term, medium‑term, and long‑term forecast diagnostics.</p>
      </div>

      {/* SELECTOR */}
      <div className="fe-panel">
        <h2>Select Horizon</h2>

        <select className="fe-select" value={horizon} onChange={(e) => setHorizon(e.target.value)}>
          <option value="short">Short Term (1–7 days)</option>
          <option value="medium">Medium Term (1–3 months)</option>
          <option value="long">Long Term (6–12 months)</option>
        </select>
      </div>

      {/* FORECAST */}
      <div className="fe-panel">
        <h2>Forecast</h2>

        <pre className="fe-block">
{horizon === "short" && `BTC: Mild Upside
ETH: Neutral
SOL: Mild Downside
Confidence: 62%`}

{horizon === "medium" && `BTC: Uptrend Forming
ETH: Strong Momentum
SOL: Neutral
Confidence: 71%`}

{horizon === "long" && `BTC: Macro‑Driven Upside
ETH: Structural Strength
SOL: High Uncertainty
Confidence: 54%`}
        </pre>
      </div>

      {/* CURVE */}
      <div className="fe-panel">
        <h2>Forecast Curve</h2>

        <pre className="fe-block">
{`Forecast
────────────────────────
1d     ████
7d     ████████
30d    ███████████████
90d    ███████████████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="fe-panel">
        <h2>Forecast Log</h2>

        <ul className="fe-log">
          <li>Horizon selected</li>
          <li>Forecast model simulated</li>
          <li>Confidence computed</li>
        </ul>
      </div>

    </div>
  );
}


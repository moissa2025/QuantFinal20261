import { useState } from "react";

export default function OrderFlowLab() {
  const [feature, setFeature] = useState("ofi");

  return (
    <div className="ofl-container">

      <div className="ofl-header">
        <h1>Order Flow Prediction Lab</h1>
        <p>Microstructure features, LSTM signals, and prediction diagnostics.</p>
      </div>

      {/* FEATURE SELECTOR */}
      <div className="ofl-panel">
        <h2>Select Feature</h2>

        <select className="ofl-select" value={feature} onChange={(e) => setFeature(e.target.value)}>
          <option value="ofi">Order Flow Imbalance</option>
          <option value="vpin">VPIN</option>
          <option value="pressure">Liquidity Pressure</option>
          <option value="vol">Short-Term Volatility</option>
        </select>
      </div>

      {/* FEATURE VALUES */}
      <div className="ofl-panel">
        <h2>Feature Values</h2>

        <pre className="ofl-values">
{feature === "ofi" && `+420
+180
-320
+110`}

{feature === "vpin" && `0.62
0.58
0.71
0.65`}

{feature === "pressure" && `High
Medium
High
Low`}

{feature === "vol" && `12%
18%
22%
15%`}
        </pre>
      </div>

      {/* PREDICTION */}
      <div className="ofl-panel">
        <h2>Predicted Order Flow Direction</h2>

        <pre className="ofl-pred">
{`Prediction
────────────────────────
Buy Pressure ↑
Buy Pressure ↑
Sell Pressure ↓
Buy Pressure ↑`}
        </pre>
      </div>

      {/* FEATURE IMPORTANCE */}
      <div className="ofl-panel">
        <h2>Feature Importance</h2>

        <ul className="ofl-importance">
          <li>OFI — <strong>42%</strong></li>
          <li>VPIN — <strong>28%</strong></li>
          <li>Pressure — <strong>18%</strong></li>
          <li>Volatility — <strong>12%</strong></li>
        </ul>
      </div>

      {/* LOG */}
      <div className="ofl-panel">
        <h2>Prediction Log</h2>

        <ul className="ofl-log">
          <li>Features normalized</li>
          <li>LSTM forward pass simulated</li>
          <li>Prediction generated</li>
        </ul>
      </div>

    </div>
  );
}


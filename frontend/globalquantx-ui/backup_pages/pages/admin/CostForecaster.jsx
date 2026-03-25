import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function CostForecaster() {
  const [size, setSize] = useState("1.0"    </DockablePanel>
  );

  return (
    <div className="cf-container">

      <div className="cf-header">
        <h1>Execution‑Cost Forecaster</h1>
        <p>Impact, slippage, spread, and cost diagnostics.</p>


      {/* INPUT */}
      <div className="cf-panel">
        <h2>Order Size</h2>

        <input
          className="cf-input"
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />


      {/* COST BREAKDOWN */}
      <div className="cf-panel">
        <h2>Cost Breakdown</h2>

        <pre className="cf-block">
{`Spread Cost:       $4.20
Slippage:           $6.80
Impact:             $12.40

Total Cost:         $23.40`}
        </pre>


      {/* IMPACT CURVE */}
      <div className="cf-panel">
        <h2>Impact Curve</h2>

        <pre className="cf-block">
{`Size (BTC)   Impact ($)
────────────────────────
0.1           1.20
0.5           4.80
1.0           12.40
2.0           38.50`}
        </pre>


      {/* LOG */}
      <div className="cf-panel">
        <h2>Cost Forecast Log</h2>

        <ul className="cf-log">
          <li>Size parsed</li>
          <li>Impact curve loaded</li>
          <li>Cost forecast computed</li>
        </ul>



</DockablePanel>
  );
}


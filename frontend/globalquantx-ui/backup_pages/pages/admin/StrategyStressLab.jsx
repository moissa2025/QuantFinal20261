import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function StrategyStressLab() {
  const [shock, setShock] = useState("mild"    </DockablePanel>
  );

  return (
    <div className="dd-container">

      <div className="dd-header">
        <h1>Systematic Strategy Stress Lab</h1>
        <p>Parameter shocks, noise, drift, and stress diagnostics.</p>


      {/* SHOCK SELECTOR */}
      <div className="dd-panel">
        <h2>Select Stress Level</h2>

        <select className="dd-select" value={shock} onChange={(e) => setShock(e.target.value)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>


      {/* STRESS DETAILS */}
      <div className="dd-panel">
        <h2>Stress Details</h2>

        <pre className="dd-block">
{shock === "mild" && `Sharpe: 1.28
Drawdown: -6.2%
Stability: High`}

{shock === "moderate" && `Sharpe: 0.92
Drawdown: -14.8%
Stability: Medium`}

{shock === "severe" && `Sharpe: 0.48
Drawdown: -28.4%
Stability: Low`}
        </pre>


      {/* CURVE */}
      <div className="dd-panel">
        <h2>Stress Curve</h2>

        <pre className="dd-block">
{`Stress
────────────────────────
0%     ███████████████████████
10%    ███████████████
20%    ███████████
40%    ██████
60%    ██`}
        </pre>


      {/* LOG */}
      <div className="dd-panel">
        <h2>Stress Log</h2>

        <ul className="dd-log">
          <li>Shock applied</li>
          <li>Stress curve generated</li>
          <li>Diagnostics updated</li>
        </ul>



</DockablePanel>
  );
}


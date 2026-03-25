import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LiquidityShockboard() {
  const [severity, setSeverity] = useState("medium"    </DockablePanel>
  );

  return (
    <div className="ct-container">

      <div className="ct-header">
        <h1>Multi‑Asset Liquidity Shockboard</h1>
        <p>Depth collapse, spread blowouts, and liquidity shock diagnostics.</p>


      {/* SEVERITY SELECTOR */}
      <div className="ct-panel">
        <h2>Select Shock Severity</h2>

        <select className="ct-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>


      {/* SHOCK DETAILS */}
      <div className="ct-panel">
        <h2>Shock Details</h2>

        <pre className="ct-block">
{severity === "low" && `Depth -20%
Spread × 2
Impact +40%`}

{severity === "medium" && `Depth -50%
Spread × 4
Impact +120%`}

{severity === "high" && `Depth -85%
Spread × 10
Impact +300%
Liquidity Vacuum Detected`}
        </pre>


      {/* HEATMAP */}
      <div className="ct-panel">
        <h2>Shock Heatmap</h2>

        <pre className="ct-block">
{`Depth Stress:       ████████████████
Spread Stress:       ███████████
Impact Stress:       █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="ct-panel">
        <h2>Shock Log</h2>

        <ul className="ct-log">
          <li>Shock applied</li>
          <li>Depth collapse simulated</li>
          <li>Impact curve updated</li>
        </ul>



</DockablePanel>
  );
}


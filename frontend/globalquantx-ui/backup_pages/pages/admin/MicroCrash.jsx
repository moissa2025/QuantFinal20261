import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MicroCrash() {
  const [severity, setSeverity] = useState("medium"    </DockablePanel>
  );

  return (
    <div className="mc-container">

      <div className="mc-header">
        <h1>Market Micro‑Crash Simulator</h1>
        <p>Flash-crash dynamics, liquidity vacuums, and impact cascades.</p>


      {/* SEVERITY SELECTOR */}
      <div className="mc-panel">
        <h2>Crash Severity</h2>

        <select className="mc-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>


      {/* CRASH DETAILS */}
      <div className="mc-panel">
        <h2>Crash Dynamics</h2>

        <pre className="mc-block">
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


      {/* TIMELINE */}
      <div className="mc-panel">
        <h2>Crash Timeline</h2>

        <pre className="mc-block">
{`21:10:44  Depth collapses
21:10:45  Spread blows out
21:10:46  Impact cascade
21:10:47  Liquidity vacuum`}
        </pre>


      {/* LOG */}
      <div className="mc-panel">
        <h2>Crash Event Log</h2>

        <ul className="mc-log">
          <li>Crash severity selected</li>
          <li>Crash dynamics simulated</li>
          <li>Timeline generated</li>
        </ul>



</DockablePanel>
  );
}


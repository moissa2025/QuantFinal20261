import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionScenarioLab() {
  const [scenario, setScenario] = useState("venue"    </DockablePanel>
  );

  return (
    <div className="dg-container">

      <div className="dg-header">
        <h1>Execution‑Risk Scenario Lab</h1>
        <p>Venue stress, routing stress, and execution diagnostics.</p>


      <div className="dg-panel">
        <h2>Select Scenario</h2>
        <select className="dg-select" value={scenario} onChange={(e) => setScenario(e.target.value)}>
          <option value="venue">Venue Stress</option>
          <option value="routing">Routing Stress</option>
        </select>


      <div className="dg-panel">
        <h2>Scenario Details</h2>
        <pre className="dg-block">
{scenario === "venue" && `Venue A: Depth -60%
Venue B: Spread × 3
Venue C: Latency +40ms`}

{scenario === "routing" && `Routing Path 1: Impact +22%
Routing Path 2: Slippage +14%
Routing Path 3: Latency Spike`}
        </pre>


      <div className="dg-panel">
        <h2>Execution Stress Heatmap</h2>
        <pre className="dg-block">
{`Venue Stress:        █████████████████████
Routing Stress:      ███████████
Impact Stress:       ████████████████`}
        </pre>


      <div className="dg-panel">
        <h2>Scenario Log</h2>
        <ul className="dg-log">
          <li>Scenario applied</li>
          <li>Stress computed</li>
          <li>Diagnostics updated</li>
        </ul>



</DockablePanel>
  );
}


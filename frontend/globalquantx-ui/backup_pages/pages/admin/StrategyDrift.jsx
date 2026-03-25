import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function StrategyDrift() {
  const [strategy, setStrategy] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="dh-container">

      <div className="dh-header">
        <h1>Systematic Strategy Drift Analyzer</h1>
        <p>Parameter drift, signal drift, and diagnostics.</p>


      <div className="dh-panel">
        <h2>Select Strategy</h2>
        <select className="dh-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="carry">Carry</option>
          <option value="value">Value</option>
        </select>


      <div className="dh-panel">
        <h2>Drift Metrics</h2>
        <pre className="dh-block">
{`Parameter Drift:     18%
Signal Drift:         12%
Stability:            Medium`}
        </pre>


      <div className="dh-panel">
        <h2>Drift Heatmap</h2>
        <pre className="dh-block">
{`Parameter Drift:     ███████████
Signal Drift:         ████████████████
Stability:            ███████`}
        </pre>


      <div className="dh-panel">
        <h2>Drift Log</h2>
        <ul className="dh-log">
          <li>Drift computed</li>
          <li>Diagnostics updated</li>
          <li>Heatmap refreshed</li>
        </ul>



</DockablePanel>
  );
}


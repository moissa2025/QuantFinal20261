import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function StrategyLifecycle() {
  const [stage, setStage] = useState("design"    </DockablePanel>
  );

  return (
    <div className="da-container">

      <div className="da-header">
        <h1>Systematic Strategy Lifecycle Manager</h1>
        <p>Design → test → deploy lifecycle diagnostics.</p>


      {/* STAGE SELECTOR */}
      <div className="da-panel">
        <h2>Select Lifecycle Stage</h2>

        <select className="da-select" value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="design">Design</option>
          <option value="test">Test</option>
          <option value="deploy">Deploy</option>
        </select>


      {/* STAGE DETAILS */}
      <div className="da-panel">
        <h2>Stage Details</h2>

        <pre className="da-block">
{stage === "design" && `Signal: Momentum
Parameters: Stable
Complexity: Moderate`}

{stage === "test" && `Sharpe: 1.42
Drawdown: -8.4%
Stability: High`}

{stage === "deploy" && `Capacity: $140M
Latency: Low
Deployment Readiness: High`}
        </pre>


      {/* HEATMAP */}
      <div className="da-panel">
        <h2>Lifecycle Heatmap</h2>

        <pre className="da-block">
{`Design Quality:       ████████████████
Backtest Strength:     ███████████
Deployment Readiness:  █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="da-panel">
        <h2>Lifecycle Log</h2>

        <ul className="da-log">
          <li>Stage selected</li>
          <li>Diagnostics computed</li>
          <li>Lifecycle updated</li>
        </ul>



</DockablePanel>
  );
}


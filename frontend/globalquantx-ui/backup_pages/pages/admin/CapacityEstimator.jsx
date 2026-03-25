import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function CapacityEstimator() {
  const [strategy, setStrategy] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="cap-container">

      <div className="cap-header">
        <h1>Systematic Strategy Capacity Estimator</h1>
        <p>Impact scaling, turnover, and capacity diagnostics.</p>


      {/* STRATEGY SELECTOR */}
      <div className="cap-panel">
        <h2>Select Strategy</h2>

        <select className="cap-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="meanrev">Mean Reversion</option>
          <option value="carry">Carry</option>
        </select>


      {/* CAPACITY CURVE */}
      <div className="cap-panel">
        <h2>Capacity Curve</h2>

        <pre className="cap-block">
{`AUM ($M)   Impact Cost
────────────────────────
10          $0.4M
50          $3.2M
100         $9.8M
200         $28.4M`}
        </pre>


      {/* LIMIT */}
      <div className="cap-panel">
        <h2>Estimated Capacity Limit</h2>

        <pre className="cap-block">
{`Capacity Limit:   ~$140M
Turnover:          38%
Constraint:        Market Impact`}
        </pre>


      {/* LOG */}
      <div className="cap-panel">
        <h2>Capacity Log</h2>

        <ul className="cap-log">
          <li>Impact curve loaded</li>
          <li>Turnover applied</li>
          <li>Capacity limit estimated</li>
        </ul>



</DockablePanel>
  );
}


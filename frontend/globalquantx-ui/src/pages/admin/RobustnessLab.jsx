import { useState } from "react";

export default function RobustnessLab() {
  const [strategy, setStrategy] = useState("momentum");

  return (
    <div className="rl-container">

      <div className="rl-header">
        <h1>Systematic Strategy Robustness Lab</h1>
        <p>Perturbations, noise, shocks, and robustness diagnostics.</p>
      </div>

      {/* STRATEGY SELECTOR */}
      <div className="rl-panel">
        <h2>Select Strategy</h2>

        <select className="rl-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="meanrev">Mean Reversion</option>
          <option value="carry">Carry</option>
        </select>
      </div>

      {/* ROBUSTNESS CURVE */}
      <div className="rl-panel">
        <h2>Robustness Curve</h2>

        <pre className="rl-block">
{`Perturbation (%)   Sharpe
────────────────────────
0%                  1.42
5%                  1.31
10%                 1.18
20%                 0.92`}
        </pre>
      </div>

      {/* DIAGNOSTICS */}
      <div className="rl-panel">
        <h2>Robustness Diagnostics</h2>

        <pre className="rl-block">
{`Stability: Moderate
Noise Sensitivity: Medium
Shock Resilience: Low`}
        </pre>
      </div>

      {/* LOG */}
      <div className="rl-panel">
        <h2>Robustness Log</h2>

        <ul className="rl-log">
          <li>Perturbations applied</li>
          <li>Noise injected</li>
          <li>Robustness curve generated</li>
        </ul>
      </div>

    </div>
  );
}


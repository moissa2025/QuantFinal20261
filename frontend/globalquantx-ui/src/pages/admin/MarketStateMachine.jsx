import { useState } from "react";

export default function MarketStateMachine() {
  const [state, setState] = useState("macro");

  return (
    <div className="cv-container">

      <div className="cv-header">
        <h1>Global Market State Machine</h1>
        <p>Macro → micro → execution state transitions and diagnostics.</p>
      </div>

      {/* STATE SELECTOR */}
      <div className="cv-panel">
        <h2>Select State Layer</h2>

        <select className="cv-select" value={state} onChange={(e) => setState(e.target.value)}>
          <option value="macro">Macro State</option>
          <option value="micro">Microstructure State</option>
          <option value="execution">Execution State</option>
        </select>
      </div>

      {/* STATE DETAILS */}
      <div className="cv-panel">
        <h2>State Details</h2>

        <pre className="cv-block">
{state === "macro" && `Growth: Rising
Inflation: Elevated
Liquidity: Tightening
Macro State: Expansion → Fragile`}

{state === "micro" && `Volatility: Elevated
Liquidity: Stable
Micro‑Trend: Up
Micro State: Expansion`}

{state === "execution" && `Spread: Narrow
Depth: Medium
Impact: Low
Execution State: Favorable`}
        </pre>
      </div>

      {/* TRANSITION PROBABILITIES */}
      <div className="cv-panel">
        <h2>Transition Probabilities</h2>

        <pre className="cv-block">
{`Macro → Micro:        72%
Micro → Execution:     81%
Execution → Macro:     14%`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="cv-panel">
        <h2>State Machine Heatmap</h2>

        <pre className="cv-block">
{`Macro Stress:         ███████████
Micro Stress:          ████████████████
Execution Stress:      ███████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="cv-panel">
        <h2>State Machine Log</h2>

        <ul className="cv-log">
          <li>Macro state updated</li>
          <li>Microstructure state computed</li>
          <li>Execution state evaluated</li>
        </ul>
      </div>

    </div>
  );
}


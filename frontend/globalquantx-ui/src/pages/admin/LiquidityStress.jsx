import { useState } from "react";

export default function LiquidityStress() {
  const [scenario, setScenario] = useState("depth");

  return (
    <div className="ls-container">

      <div className="ls-header">
        <h1>Liquidity Stress Tester</h1>
        <p>Depth collapse, spread blowout, and impact simulation.</p>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="ls-panel">
        <h2>Select Stress Scenario</h2>

        <select className="ls-select" value={scenario} onChange={(e) => setScenario(e.target.value)}>
          <option value="depth">Depth Collapse</option>
          <option value="spread">Spread Blowout</option>
          <option value="impact">Impact Explosion</option>
        </select>
      </div>

      {/* STRESS DETAILS */}
      <div className="ls-panel">
        <h2>Stress Details</h2>

        <pre className="ls-block">
{scenario === "depth" && `Depth -70%
Order book thinned
Liquidity pockets vanished`}

{scenario === "spread" && `Spread × 4
Top-of-book unstable
Quote flickering`}

{scenario === "impact" && `Impact +120%
Slippage nonlinear
Execution cost spike`}
        </pre>
      </div>

      {/* STRESS PNL */}
      <div className="ls-panel">
        <h2>Stress PnL</h2>

        <pre className="ls-block">
{`BTCUSD   -$2.8M
ETHUSD   -$1.4M
SOLUSD   -$0.6M

Total    -$4.8M`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ls-panel">
        <h2>Stress Log</h2>

        <ul className="ls-log">
          <li>Scenario applied</li>
          <li>Liquidity shocked</li>
          <li>Stress PnL computed</li>
        </ul>
      </div>

    </div>
  );
}


import { useState } from "react";

export default function MacroStress() {
  const [shock, setShock] = useState("growth");

  return (
    <div className="msb-container">

      <div className="msb-header">
        <h1>Global Macro Stress Board</h1>
        <p>Growth, inflation, and liquidity shock diagnostics.</p>
      </div>

      {/* SHOCK SELECTOR */}
      <div className="msb-panel">
        <h2>Select Shock Scenario</h2>

        <select className="msb-select" value={shock} onChange={(e) => setShock(e.target.value)}>
          <option value="growth">Growth Shock</option>
          <option value="inflation">Inflation Shock</option>
          <option value="liquidity">Liquidity Shock</option>
        </select>
      </div>

      {/* SHOCK DETAILS */}
      <div className="msb-panel">
        <h2>Shock Details</h2>

        <pre className="msb-block">
{shock === "growth" && `GDP Surprise:       -1.2%
PMI Collapse:       -4.8
Risk Appetite:      Sharp Decline`}

{shock === "inflation" && `CPI Surprise:       +0.9%
Wage Spike:         +0.6%
Inflation Regime:   Hot`}

{shock === "liquidity" && `Funding Stress:     Elevated
Credit Spreads:     +42 bps
Liquidity Regime:   Tightening`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="msb-panel">
        <h2>Stress Heatmap</h2>

        <pre className="msb-block">
{`Growth Stress:      ████████████████
Inflation Stress:    ███████████
Liquidity Stress:    █████████████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="msb-panel">
        <h2>Stress Event Log</h2>

        <ul className="msb-log">
          <li>Shock applied</li>
          <li>Macro stress computed</li>
          <li>Heatmap updated</li>
        </ul>
      </div>

    </div>
  );
}


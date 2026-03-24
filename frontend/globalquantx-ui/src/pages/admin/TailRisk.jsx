import { useState } from "react";

export default function TailRisk() {
  const [shock, setShock] = useState("mild");

  return (
    <div className="tr-container">

      <div className="tr-header">
        <h1>Portfolio Drawdown & Tail‑Risk Lab</h1>
        <p>CVaR, EVT, tail shocks, and drawdown diagnostics.</p>
      </div>

      {/* SHOCK SELECTOR */}
      <div className="tr-panel">
        <h2>Select Tail Shock</h2>

        <select className="tr-select" value={shock} onChange={(e) => setShock(e.target.value)}>
          <option value="mild">Mild Shock</option>
          <option value="moderate">Moderate Shock</option>
          <option value="severe">Severe Shock</option>
        </select>
      </div>

      {/* SHOCK DETAILS */}
      <div className="tr-panel">
        <h2>Shock Details</h2>

        <pre className="tr-block">
{shock === "mild" && `Portfolio Drawdown:   -4.2%
CVaR (95%):          -6.8%
Tail Risk:           Low`}

{shock === "moderate" && `Portfolio Drawdown:   -12.4%
CVaR (95%):          -18.2%
Tail Risk:           Medium`}

{shock === "severe" && `Portfolio Drawdown:   -28.5%
CVaR (95%):          -41.2%
Tail Risk:           High`}
        </pre>
      </div>

      {/* DRAWDOWN CURVE */}
      <div className="tr-panel">
        <h2>Drawdown Curve</h2>

        <pre className="tr-block">
{`Drawdown
────────────────────────
0%     ███████████████████████
-5%    ███████████████
-10%   ███████████
-20%   ██████
-30%   ██`}
        </pre>
      </div>

      {/* LOG */}
      <div className="tr-panel">
        <h2>Tail‑Risk Log</h2>

        <ul className="tr-log">
          <li>Shock applied</li>
          <li>CVaR computed</li>
          <li>Drawdown curve generated</li>
        </ul>
      </div>

    </div>
  );
}


import { useState } from "react";

export default function StressGenerator() {
  const [scenario, setScenario] = useState("crash");

  return (
    <div className="sg-container">

      <div className="sg-header">
        <h1>Stress Scenario Generator</h1>
        <p>Macro shocks, vol shocks, contagion, and stress PnL.</p>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="sg-panel">
        <h2>Select Scenario</h2>

        <select className="sg-select" value={scenario} onChange={(e) => setScenario(e.target.value)}>
          <option value="crash">Market Crash</option>
          <option value="volshock">Volatility Shock</option>
          <option value="liquidity">Liquidity Freeze</option>
          <option value="macro">Macro Shock</option>
        </select>
      </div>

      {/* SHOCK DETAILS */}
      <div className="sg-panel">
        <h2>Shock Details</h2>

        <pre className="sg-shock">
{scenario === "crash" && `BTC -15%
ETH -18%
SOL -25%
AVAX -22%`}

{scenario === "volshock" && `Vol +40%
Skew +22%
Term Structure Steepening`}

{scenario === "liquidity" && `Spread × 3
Depth -60%
Impact +80%`}

{scenario === "macro" && `Rates +150bps
USD +4%
Commodities -8%`}
        </pre>
      </div>

      {/* STRESS PNL */}
      <div className="sg-panel">
        <h2>Stress PnL</h2>

        <pre className="sg-pnl">
{`BTCUSD   -$3.2M
ETHUSD   -$1.8M
SOLUSD   -$0.9M
AVAXUSD  -$0.4M

Total    -$6.3M`}
        </pre>
      </div>

      {/* EVENT LOG */}
      <div className="sg-panel">
        <h2>Stress Event Log</h2>

        <ul className="sg-log">
          <li>Scenario applied</li>
          <li>Portfolio shocked</li>
          <li>Stress PnL computed</li>
        </ul>
      </div>

    </div>
  );
}


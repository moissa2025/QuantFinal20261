import { useState } from "react";

export default function StressCorrelation() {
  const [scenario, setScenario] = useState("crash");

  return (
    <div className="sc-container">

      <div className="sc-header">
        <h1>Multi‑Asset Stress Correlation Engine</h1>
        <p>Tail correlation, contagion, and stress‑scenario correlation.</p>
      </div>

      {/* SCENARIO SELECTOR */}
      <div className="sc-panel">
        <h2>Select Scenario</h2>

        <select className="sc-select" value={scenario} onChange={(e) => setScenario(e.target.value)}>
          <option value="crash">Market Crash</option>
          <option value="vol">Volatility Shock</option>
          <option value="liquidity">Liquidity Freeze</option>
        </select>
      </div>

      {/* CORRELATION MATRIX */}
      <div className="sc-panel">
        <h2>Stress Correlation Matrix</h2>

        <pre className="sc-block">
{`          BTC   ETH   SOL   AVAX   Gold   Bonds
BTC       1.00  0.88  0.72  0.65   0.22   -0.12
ETH       0.88  1.00  0.81  0.74   0.18   -0.15
SOL       0.72  0.81  1.00  0.78   0.10   -0.22
AVAX      0.65  0.74  0.78  1.00   0.08   -0.18
Gold      0.22  0.18  0.10  0.08   1.00    0.42
Bonds    -0.12 -0.15 -0.22 -0.18   0.42    1.00`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="sc-panel">
        <h2>Stress Heatmap</h2>

        <pre className="sc-block">
{`Crypto Cluster:     ████████████████████
Safe Havens:         ████
Contagion Risk:      ███████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="sc-panel">
        <h2>Stress Correlation Log</h2>

        <ul className="sc-log">
          <li>Tail correlation elevated</li>
          <li>Crypto cluster tightening</li>
          <li>Safe‑haven divergence detected</li>
        </ul>
      </div>

    </div>
  );
}


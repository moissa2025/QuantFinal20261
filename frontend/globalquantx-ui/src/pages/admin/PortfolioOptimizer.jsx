import { useState } from "react";

export default function PortfolioOptimizer() {
  const [method, setMethod] = useState("markowitz");

  return (
    <div className="po-container">

      <div className="po-header">
        <h1>Portfolio Optimizer</h1>
        <p>Markowitz, Black‑Litterman, and Risk Parity optimization.</p>
      </div>

      {/* METHOD SELECTOR */}
      <div className="po-panel">
        <h2>Optimization Method</h2>

        <select className="po-select" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="markowitz">Markowitz (Mean‑Variance)</option>
          <option value="blacklitterman">Black‑Litterman</option>
          <option value="riskparity">Risk Parity</option>
        </select>
      </div>

      {/* RESULTS */}
      <div className="po-panel">
        <h2>Optimal Weights</h2>

        <pre className="po-weights">
{method === "markowitz" && `BTC  42%
ETH  33%
SOL  15%
AVAX 10%`}

{method === "blacklitterman" && `BTC  38%
ETH  36%
SOL  14%
AVAX 12%`}

{method === "riskparity" && `BTC  25%
ETH  25%
SOL  25%
AVAX 25%`}
        </pre>
      </div>

      {/* FRONTIER */}
      <div className="po-panel">
        <h2>Efficient Frontier</h2>

        <pre className="po-frontier">
{`Risk →     Return →
────────────────────────
5%          4.2%
8%          6.1%
12%         8.4%
18%         11.2%`}
        </pre>
      </div>

      {/* PORTFOLIO STATS */}
      <div className="po-panel">
        <h2>Portfolio Statistics</h2>

        <ul className="po-stats">
          <li>Expected Return — <strong>8.4%</strong></li>
          <li>Volatility — <strong>12.1%</strong></li>
          <li>Sharpe Ratio — <strong>0.69</strong></li>
        </ul>
      </div>

      {/* LOG */}
      <div className="po-panel">
        <h2>Optimization Log</h2>

        <ul className="po-log">
          <li>Covariance matrix loaded</li>
          <li>Constraints applied</li>
          <li>Optimization converged</li>
        </ul>
      </div>

    </div>
  );
}


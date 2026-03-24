import { useState } from "react";

export default function PortfolioRisk() {
  const [portfolio, setPortfolio] = useState("Prime Fund Capital");

  return (
    <div className="pr-container">

      {/* HEADER */}
      <div className="pr-header">
        <h1>Portfolio Risk Analytics</h1>
        <p>VaR, stress tests, Greeks, and exposure analytics.</p>
      </div>

      {/* PORTFOLIO SELECTOR */}
      <div className="pr-panel">
        <h2>Select Portfolio</h2>

        <select
          className="pr-select"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
        >
          <option>Prime Fund Capital</option>
          <option>NorthBridge Investments</option>
          <option>Apex Quant Group</option>
        </select>
      </div>

      {/* VAR */}
      <div className="pr-panel">
        <h2>Value‑at‑Risk (VaR)</h2>

        <div className="pr-row">
          <div className="pr-card">
            <h3>1‑Day VaR</h3>
            <div className="metric">$1.42M</div>
          </div>

          <div className="pr-card">
            <h3>10‑Day VaR</h3>
            <div className="metric">$4.88M</div>
          </div>

          <div className="pr-card">
            <h3>Confidence Level</h3>
            <div className="metric">99%</div>
          </div>

          <div className="pr-card">
            <h3>Method</h3>
            <div className="metric">Historical</div>
          </div>
        </div>
      </div>

      {/* STRESS TESTS */}
      <div className="pr-panel">
        <h2>Stress Tests</h2>

        <table className="pr-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Shock</th>
              <th>Impact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>BTC ‑15%</td>
              <td>Price Shock</td>
              <td className="negative">‑$3.2M</td>
              <td><button className="pr-btn small">Run</button></td>
            </tr>

            <tr>
              <td>ETH Volatility Spike</td>
              <td>Vol +40%</td>
              <td className="negative">‑$1.1M</td>
              <td><button className="pr-btn small">Run</button></td>
            </tr>

            <tr>
              <td>Cross‑Asset Crash</td>
              <td>All assets ‑10%</td>
              <td className="negative">‑$5.8M</td>
              <td><button className="pr-btn small">Run</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GREEKS */}
      <div className="pr-panel">
        <h2>Greeks</h2>

        <ul className="pr-greeks">
          <li>Delta — <strong>+128.4</strong></li>
          <li>Gamma — <strong>0.84</strong></li>
          <li>Vega — <strong>+42.1</strong></li>
          <li>Theta — <strong>‑12.4</strong></li>
          <li>Rho — <strong>+5.8</strong></li>
        </ul>
      </div>

      {/* EXPOSURE BREAKDOWN */}
      <div className="pr-panel">
        <h2>Exposure Breakdown</h2>

        <pre className="pr-exposure">
{`BTCUSD     ██████████████████████  $22.4M
ETHUSD     ████████████            $12.1M
SOLUSD     ██████                  $4.8M
AVAXUSD    ████                    $3.2M`}
        </pre>
      </div>

      {/* CONCENTRATION RISK */}
      <div className="pr-panel">
        <h2>Concentration Risk</h2>

        <ul className="pr-concentration">
          <li>Top Asset Weight — <span className="warning">54%</span></li>
          <li>Top 3 Assets — <span className="warning">82%</span></li>
          <li>Portfolio Diversification Score — <span className="positive">B+</span></li>
        </ul>
      </div>

      {/* PNL ATTRIBUTION */}
      <div className="pr-panel">
        <h2>PnL Attribution</h2>

        <ul className="pr-pnl">
          <li>BTCUSD — <span className="positive">+$420k</span></li>
          <li>ETHUSD — <span className="positive">+$180k</span></li>
          <li>SOLUSD — <span className="negative">‑$90k</span></li>
          <li>AVAXUSD — <span className="negative">‑$40k</span></li>
        </ul>
      </div>

      {/* RISK EVENTS */}
      <div className="pr-panel">
        <h2>Risk Event Log</h2>

        <ul className="pr-log">
          <li><strong>2026‑03‑23 21:10</strong> — VaR exceeded threshold</li>
          <li><strong>2026‑03‑23 18:44</strong> — Concentration risk alert</li>
          <li><strong>2026‑03‑23 14:12</strong> — Vega spike detected</li>
        </ul>
      </div>

    </div>
  );
}


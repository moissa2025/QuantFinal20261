import { useState } from "react";

export default function Liquidity() {
  const [symbol, setSymbol] = useState("BTCUSD");

  return (
    <div className="liq-container">

      {/* HEADER */}
      <div className="liq-header">
        <h1>Liquidity & Market Quality Dashboard</h1>
        <p>Depth, spreads, slippage, and market‑quality analytics.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="liq-panel">
        <h2>Select Market</h2>

        <select
          className="liq-select"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
          <option>AVAXUSD</option>
        </select>
      </div>

      {/* TOP OF BOOK */}
      <div className="liq-panel">
        <h2>Top of Book</h2>

        <div className="liq-row">
          <div className="liq-card">
            <h3>Best Bid</h3>
            <div className="metric">$68,200</div>
          </div>

          <div className="liq-card">
            <h3>Best Ask</h3>
            <div className="metric">$68,210</div>
          </div>

          <div className="liq-card">
            <h3>Spread</h3>
            <div className="metric positive">0.015%</div>
          </div>

          <div className="liq-card">
            <h3>Mid Price</h3>
            <div className="metric">$68,205</div>
          </div>
        </div>
      </div>

      {/* DEPTH SNAPSHOT */}
      <div className="liq-panel">
        <h2>Order Book Depth</h2>

        <table className="liq-table">
          <thead>
            <tr>
              <th>Bid Size</th>
              <th>Bid Price</th>
              <th>Ask Price</th>
              <th>Ask Size</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1.2 BTC</td>
              <td>$68,200</td>
              <td>$68,210</td>
              <td>0.9 BTC</td>
            </tr>

            <tr>
              <td>0.8 BTC</td>
              <td>$68,180</td>
              <td>$68,230</td>
              <td>1.4 BTC</td>
            </tr>

            <tr>
              <td>2.1 BTC</td>
              <td>$68,150</td>
              <td>$68,250</td>
              <td>0.7 BTC</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* LIQUIDITY HEATMAP */}
      <div className="liq-panel">
        <h2>Liquidity Heatmap</h2>

        <pre className="liq-heatmap">
{`Price     Depth
68250     ████████
68230     █████████████
68210     ███████████████████
68200     ██████████████████████████
68180     ███████████████
68150     ███████`}
        </pre>
      </div>

      {/* MARKET QUALITY METRICS */}
      <div className="liq-panel">
        <h2>Market Quality Metrics</h2>

        <ul className="liq-metrics">
          <li>Effective Spread — <strong>0.018%</strong></li>
          <li>Realized Spread — <strong>0.012%</strong></li>
          <li>Slippage (avg) — <strong>0.004%</strong></li>
          <li>Fill Ratio — <strong>92%</strong></li>
          <li>Market Impact (1 BTC) — <strong>$14.20</strong></li>
        </ul>
      </div>

      {/* VENUE LIQUIDITY SCORE */}
      <div className="liq-panel">
        <h2>Venue Liquidity Score</h2>

        <ul className="liq-score">
          <li>Depth Score — <span className="positive">A</span></li>
          <li>Spread Score — <span className="positive">A‑</span></li>
          <li>Impact Score — <span className="warning">B+</span></li>
          <li>Stability Score — <span className="positive">A</span></li>
        </ul>
      </div>

      {/* MARKET QUALITY LOG */}
      <div className="liq-panel">
        <h2>Market Quality Events</h2>

        <ul className="liq-log">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Spread widened to 0.08%  
          </li>

          <li>
            <strong>2026‑03‑23 20:44</strong> — Depth imbalance detected  
          </li>

          <li>
            <strong>2026‑03‑23 19:12</strong> — Slippage spike on large order  
          </li>
        </ul>
      </div>

    </div>
  );
}


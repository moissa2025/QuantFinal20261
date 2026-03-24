import { useState } from "react";

export default function RiskCenter() {
  const [selectedLimit, setSelectedLimit] = useState("btc");

  const limits = {
    btc: { symbol: "BTCUSD", maxNotional: 500000, maxLeverage: 5, status: "active" },
    eth: { symbol: "ETHUSD", maxNotional: 250000, maxLeverage: 4, status: "active" },
    sol: { symbol: "SOLUSD", maxNotional: 50000, maxLeverage: 3, status: "paused" }
  };

  const limit = limits[selectedLimit];

  return (
    <div className="risk-container">

      {/* HEADER */}
      <div className="risk-header">
        <h1>Risk Control Center</h1>
        <p>Limits, circuit breakers, kill switches, and exposure monitoring.</p>
      </div>

      {/* GLOBAL STATUS */}
      <div className="risk-panel">
        <h2>Global Risk Status</h2>

        <div className="risk-row">
          <div className="risk-card">
            <h3>Total Exposure</h3>
            <div className="metric">$42.8M</div>
          </div>

          <div className="risk-card">
            <h3>Margin Utilization</h3>
            <div className="metric warning">78%</div>
          </div>

          <div className="risk-card">
            <h3>Kill Switch</h3>
            <div className="metric negative">Armed</div>
          </div>

          <div className="risk-card">
            <h3>Volatility</h3>
            <div className="metric positive">Normal</div>
          </div>
        </div>
      </div>

      {/* LIMITS */}
      <div className="risk-panel">
        <h2>Risk Limits</h2>

        <select
          className="risk-select"
          value={selectedLimit}
          onChange={(e) => setSelectedLimit(e.target.value)}
        >
          <option value="btc">BTCUSD</option>
          <option value="eth">ETHUSD</option>
          <option value="sol">SOLUSD</option>
        </select>

        <div className="risk-limit-box">
          <p><strong>Symbol:</strong> {limit.symbol}</p>
          <p><strong>Max Notional:</strong> ${limit.maxNotional.toLocaleString()}</p>
          <p><strong>Max Leverage:</strong> {limit.maxLeverage}×</p>
          <p><strong>Status:</strong> <span className={limit.status === "active" ? "positive" : "warning"}>{limit.status}</span></p>
        </div>

        <button className="risk-btn">Edit Limit</button>
      </div>

      {/* CIRCUIT BREAKERS */}
      <div className="risk-panel">
        <h2>Circuit Breakers</h2>

        <table className="risk-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Threshold</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Volatility Halt</td>
              <td>±8% in 5m</td>
              <td className="positive">Enabled</td>
              <td>
                <button className="risk-btn small">Edit</button>
                <button className="risk-btn small danger">Disable</button>
              </td>
            </tr>

            <tr>
              <td>Price Band</td>
              <td>±2% from index</td>
              <td className="positive">Enabled</td>
              <td>
                <button className="risk-btn small">Edit</button>
                <button className="risk-btn small danger">Disable</button>
              </td>
            </tr>

            <tr>
              <td>Order Throttle</td>
              <td>500 orders / min</td>
              <td className="warning">Triggered</td>
              <td>
                <button className="risk-btn small">Reset</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* KILL SWITCHES */}
      <div className="risk-panel">
        <h2>Kill Switches</h2>

        <ul className="risk-kill-list">
          <li>
            Global Trading — <span className="negative">Armed</span>
            <button className="risk-btn small danger">Disarm</button>
          </li>

          <li>
            BTCUSD Trading — <span className="positive">Active</span>
            <button className="risk-btn small danger">Kill</button>
          </li>

          <li>
            User 123 — <span className="positive">Active</span>
            <button className="risk-btn small danger">Kill</button>
          </li>
        </ul>
      </div>

      {/* BREACH LOG */}
      <div className="risk-panel">
        <h2>Risk Breach Log</h2>

        <ul className="risk-log">
          <li>
            <strong>2026‑03‑23 21:10</strong> — User 456 exceeded leverage limit  
          </li>

          <li>
            <strong>2026‑03‑23 20:44</strong> — SOLUSD price band triggered  
          </li>

          <li>
            <strong>2026‑03‑22 11:12</strong> — Order throttle activated  
          </li>
        </ul>
      </div>

    </div>
  );
}


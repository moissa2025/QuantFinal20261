import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function Capacity() {
  const [nodePool, setNodePool] = useState("trading-nodes"    </DockablePanel>
  );

  const pools = {
    "trading-nodes": { min: 4, max: 20, current: 12, cpu: 62, mem: 71 },
    "marketdata-nodes": { min: 3, max: 15, current: 8, cpu: 48, mem: 55 },
    "risk-nodes": { min: 2, max: 10, current: 5, cpu: 72, mem: 68 }
  };

  const pool = pools[nodePool];

  return (
    <div className="cap-container">

      {/* HEADER */}
      <div className="cap-header">
        <h1>Capacity Planning & Autoscaling Console</h1>
        <p>Cluster capacity, autoscaling rules, and resource forecasting.</p>


      {/* NODE POOL SELECTOR */}
      <div className="cap-panel">
        <h2>Select Node Pool</h2>

        <select
          className="cap-select"
          value={nodePool}
          onChange={(e) => setNodePool(e.target.value)}
        >
          <option value="trading-nodes">Trading Nodes</option>
          <option value="marketdata-nodes">Market Data Nodes</option>
          <option value="risk-nodes">Risk Engine Nodes</option>
        </select>


      {/* POOL STATUS */}
      <div className="cap-panel">
        <h2>Node Pool Status</h2>

        <div className="cap-row">
          <div className="cap-card">
            <h3>Current Nodes</h3>
            <div className="metric">{pool.current}</div>


          <div className="cap-card">
            <h3>CPU Utilization</h3>
            <div className="metric">{pool.cpu}%</div>


          <div className="cap-card">
            <h3>Memory Utilization</h3>
            <div className="metric">{pool.mem}%</div>


          <div className="cap-card">
            <h3>Autoscaling Range</h3>
            <div className="metric">{pool.min} → {pool.max}</div>




      {/* AUTOSCALING RULES */}
      <div className="cap-panel">
        <h2>Autoscaling Rules</h2>

        <table className="cap-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Threshold</th>
              <th>Action</th>
              <th>Cooldown</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>CPU > 70%</td>
              <td>5 min</td>
              <td>Scale Up +2</td>
              <td>3 min</td>
            </tr>

            <tr>
              <td>CPU < 40%</td>
              <td>10 min</td>
              <td>Scale Down -1</td>
              <td>5 min</td>
            </tr>

            <tr>
              <td>Memory > 75%</td>
              <td>5 min</td>
              <td>Scale Up +1</td>
              <td>3 min</td>
            </tr>
          </tbody>
        </table>

        <button className="cap-btn">Edit Rules</button>


      {/* FORECASTING */}
      <div className="cap-panel">
        <h2>Forecasting</h2>

        <pre className="cap-forecast">
{`Projected Load (Next 24h)
──────────────────────────
00:00   ████████  58%
06:00   ████████████  72%
12:00   ████████████████  85%
18:00   ████████████████████  92%
24:00   ████████████  70%`}
        </pre>


      {/* MANUAL SCALING */}
      <div className="cap-panel">
        <h2>Manual Scaling</h2>

        <div className="cap-row">
          <button className="cap-btn">Scale Up +1</button>
          <button className="cap-btn">Scale Down -1</button>
          <button className="cap-btn danger">Scale to Max</button>



      {/* SCALING EVENTS */}
      <div className="cap-panel">
        <h2>Scaling Events</h2>

        <ul className="cap-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Scaled Up +2 (CPU 78%)  
          </li>

          <li>
            <strong>2026‑03‑23 18:44</strong> — Scaled Down -1 (CPU 39%)  
          </li>

          <li>
            <strong>2026‑03‑23 14:12</strong> — Scaled Up +1 (Memory 76%)  
          </li>
        </ul>



</DockablePanel>
  );
}


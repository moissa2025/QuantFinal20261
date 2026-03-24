export default function SystemStatus() {
  return (
    <div className="status-container">

      {/* HEADER */}
      <div className="status-header">
        <h1>System Status</h1>
        <p>Real‑time operational overview of all platform components.</p>
      </div>

      {/* OVERVIEW */}
      <div className="status-panel">
        <h2>Overview</h2>

        <div className="status-row">
          <div className="status-card">
            <h3>Uptime</h3>
            <div className="metric positive">99.982%</div>
          </div>

          <div className="status-card">
            <h3>Latency</h3>
            <div className="metric">12 ms</div>
          </div>

          <div className="status-card">
            <h3>Incidents (30d)</h3>
            <div className="metric warning">1</div>
          </div>

          <div className="status-card">
            <h3>Overall Status</h3>
            <div className="metric positive">Operational</div>
          </div>
        </div>
      </div>

      {/* COMPONENT HEALTH */}
      <div className="status-panel">
        <h2>Component Health</h2>

        <table className="status-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Last Check</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Market Data Stream</td>
              <td className="positive">Operational</td>
              <td>8 ms</td>
              <td>2026‑03‑23 21:10</td>
            </tr>

            <tr>
              <td>Order Engine</td>
              <td className="positive">Operational</td>
              <td>12 ms</td>
              <td>2026‑03‑23 21:10</td>
            </tr>

            <tr>
              <td>Risk Engine</td>
              <td className="positive">Operational</td>
              <td>15 ms</td>
              <td>2026‑03‑23 21:10</td>
            </tr>

            <tr>
              <td>Database Cluster</td>
              <td className="positive">Healthy</td>
              <td>4 ms</td>
              <td>2026‑03‑23 21:10</td>
            </tr>

            <tr>
              <td>WebSocket Gateway</td>
              <td className="warning">Degraded</td>
              <td>42 ms</td>
              <td>2026‑03‑23 21:10</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* REGIONAL STATUS */}
      <div className="status-panel">
        <h2>Regional Availability</h2>

        <ul className="region-list">
          <li>EU‑West — <span className="positive">Operational</span></li>
          <li>US‑East — <span className="positive">Operational</span></li>
          <li>US‑West — <span className="warning">Degraded</span></li>
          <li>APAC — <span className="positive">Operational</span></li>
        </ul>
      </div>

      {/* INCIDENT FEED */}
      <div className="status-panel">
        <h2>Incident Feed</h2>

        <ul className="incident-list">
          <li>
            <strong>2026‑03‑12</strong> — Market stream reconnect event  
            <span className="incident-meta positive">Resolved</span>
          </li>

          <li>
            <strong>2026‑02‑28</strong> — Order engine latency spike  
            <span className="incident-meta positive">Resolved</span>
          </li>

          <li>
            <strong>2026‑02‑14</strong> — Database maintenance window  
            <span className="incident-meta">Completed</span>
          </li>
        </ul>
      </div>

      {/* RAW HEARTBEAT */}
      <div className="status-panel">
        <h2>Heartbeat Stream</h2>

        <pre className="status-heartbeat">
{`[21:10:44] OK   market_data: 8ms
[21:10:44] OK   order_engine: 12ms
[21:10:44] OK   risk_engine: 15ms
[21:10:44] WARN websocket_gateway: 42ms`}
        </pre>
      </div>

    </div>
  );
}


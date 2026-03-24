import { useState } from "react";

export default function Observability() {
  const [tab, setTab] = useState("logs");
  const [service, setService] = useState("order-engine");

  return (
    <div className="obs-container">

      {/* HEADER */}
      <div className="obs-header">
        <h1>Observability Hub</h1>
        <p>Logs, traces, metrics, and service health in one place.</p>
      </div>

      {/* TABS */}
      <div className="obs-tabs">
        <button className={tab === "logs" ? "active" : ""} onClick={() => setTab("logs")}>Logs</button>
        <button className={tab === "traces" ? "active" : ""} onClick={() => setTab("traces")}>Traces</button>
        <button className={tab === "metrics" ? "active" : ""} onClick={() => setTab("metrics")}>Metrics</button>
        <button className={tab === "health" ? "active" : ""} onClick={() => setTab("health")}>Service Health</button>
      </div>

      {/* SERVICE SELECTOR */}
      <div className="obs-panel">
        <h2>Service</h2>

        <select
          className="obs-select"
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="order-engine">Order Engine</option>
          <option value="market-data">Market Data Stream</option>
          <option value="risk-engine">Risk Engine</option>
          <option value="websocket-gateway">WebSocket Gateway</option>
          <option value="db-cluster">Database Cluster</option>
        </select>
      </div>

      {/* LOGS TAB */}
      {tab === "logs" && (
        <div className="obs-panel">
          <h2>Logs</h2>

          <div className="obs-row">
            <div className="obs-item">
              <label>Search</label>
              <input type="text" placeholder="level:error OR user:123" />
            </div>

            <div className="obs-item">
              <label>Level</label>
              <select>
                <option>All</option>
                <option>Info</option>
                <option>Warning</option>
                <option>Error</option>
              </select>
            </div>
          </div>

          <pre className="obs-output">
{`[21:10:44] INFO  order-engine: Order matched (id=12345, price=68200)
[21:10:45] WARN  order-engine: Slow response from risk-engine (42ms)
[21:10:46] ERROR order-engine: Failed to persist trade (retrying)
[21:10:47] INFO  order-engine: Retry succeeded`}
          </pre>
        </div>
      )}

      {/* TRACES TAB */}
      {tab === "traces" && (
        <div className="obs-panel">
          <h2>Traces</h2>

          <pre className="obs-output">
{`Trace ID: 8f2c9a1d

order-engine        12ms  ────────────────■
risk-engine         18ms  ─────────────────────■
db-cluster           4ms  ─────■

Total latency: 34ms`}
          </pre>
        </div>
      )}

      {/* METRICS TAB */}
      {tab === "metrics" && (
        <div className="obs-panel">
          <h2>Metrics</h2>

          <ul className="obs-metrics">
            <li>CPU Usage — <strong>42%</strong></li>
            <li>Memory Usage — <strong>3.1 GB</strong></li>
            <li>Latency (p99) — <strong>18 ms</strong></li>
            <li>Throughput — <strong>12,400 req/s</strong></li>
            <li>Error Rate — <strong>0.12%</strong></li>
          </ul>
        </div>
      )}

      {/* HEALTH TAB */}
      {tab === "health" && (
        <div className="obs-panel">
          <h2>Service Health</h2>

          <ul className="obs-health">
            <li>Order Engine — <span className="positive">Healthy</span></li>
            <li>Market Data Stream — <span className="positive">Healthy</span></li>
            <li>Risk Engine — <span className="warning">Degraded</span></li>
            <li>WebSocket Gateway — <span className="warning">High Latency</span></li>
            <li>Database Cluster — <span className="positive">Healthy</span></li>
          </ul>
        </div>
      )}

    </div>
  );
}


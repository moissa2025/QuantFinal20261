import { useState } from "react";

export default function DataExport() {
  const [format, setFormat] = useState("csv");
  const [dataset, setDataset] = useState("trades");

  return (
    <div className="export-container">

      {/* HEADER */}
      <div className="export-header">
        <h1>Data Export Center</h1>
        <p>Download your trading and account data in CSV or JSON format.</p>
      </div>

      {/* EXPORT OPTIONS */}
      <div className="export-panel">
        <h2>Export Options</h2>

        <div className="export-row">
          <div className="export-item">
            <label>Dataset</label>
            <select value={dataset} onChange={(e) => setDataset(e.target.value)}>
              <option value="trades">Trades</option>
              <option value="positions">Positions</option>
              <option value="ledger">Ledger</option>
              <option value="audit">Audit Logs</option>
              <option value="activity">User Activity</option>
              <option value="notifications">Notifications</option>
            </select>
          </div>

          <div className="export-item">
            <label>Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        <div className="export-row">
          <div className="export-item">
            <label>Start Date</label>
            <input type="date" />
          </div>

          <div className="export-item">
            <label>End Date</label>
            <input type="date" />
          </div>
        </div>

        <button className="export-btn">Generate Export</button>
      </div>

      {/* PREVIEW */}
      <div className="export-panel">
        <h2>Preview</h2>

        <pre className="export-preview">
{dataset === "trades" && `[
  { "symbol": "BTCUSD", "side": "buy", "size": 0.5, "price": 68200 },
  { "symbol": "ETHUSD", "side": "sell", "size": 1.2, "price": 3420 }
]`}

{dataset === "positions" && `[
  { "symbol": "BTCUSD", "size": 0.5, "pnl": 1200 },
  { "symbol": "ETHUSD", "size": 1.2, "pnl": -240 }
]`}

{dataset === "ledger" && `[
  { "type": "deposit", "amount": 5000, "currency": "USD" },
  { "type": "trade_fee", "amount": -12.5, "currency": "USD" }
]`}

{dataset === "audit" && `[
  { "event": "order.executed", "timestamp": "2026-03-23T21:10:44Z" },
  { "event": "risk.alert", "timestamp": "2026-03-23T20:44:01Z" }
]`}

{dataset === "activity" && `[
  { "ip": "82.14.221.10", "device": "MacBook Pro" },
  { "ip": "192.168.1.22", "device": "iPhone 15" }
]`}

{dataset === "notifications" && `[
  { "type": "trade", "message": "Order filled" },
  { "type": "system", "message": "Maintenance scheduled" }
]`}
        </pre>
      </div>

      {/* EXPORT HISTORY */}
      <div className="export-panel">
        <h2>Export History</h2>

        <ul className="export-history">
          <li>2026‑03‑23 — Trades (CSV) — 2.1 MB</li>
          <li>2026‑03‑20 — Ledger (JSON) — 540 KB</li>
          <li>2026‑03‑18 — Audit Logs (CSV) — 8.4 MB</li>
        </ul>
      </div>

    </div>
  );
}


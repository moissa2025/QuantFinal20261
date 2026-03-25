import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function Regulatory() {
  const [selectedReport, setSelectedReport] = useState("mifid"    </DockablePanel>
  );

  return (
    <div className="reg-container">

      {/* HEADER */}
      <div className="reg-header">
        <h1>Regulatory Reporting Center</h1>
        <p>MiFID II, EMIR, AML logs, and regulator‑ready exports.</p>


      {/* REPORT SELECTOR */}
      <div className="reg-panel">
        <h2>Select Report Type</h2>

        <select
          className="reg-select"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="mifid">MiFID II Transaction Reports</option>
          <option value="emir">EMIR Trade Reports</option>
          <option value="aml">AML Event Logs</option>
          <option value="suspicious">Suspicious Activity Flags</option>
        </select>


      {/* REPORT PREVIEW */}
      <div className="reg-panel">
        <h2>Report Preview</h2>

        <pre className="reg-preview">
{selectedReport === "mifid" && `[
  { "tradeId": "T12345", "instrument": "BTCUSD", "buyer": "user_001", "seller": "user_002", "timestamp": "2026-03-23T21:10:44Z" },
  { "tradeId": "T12346", "instrument": "ETHUSD", "buyer": "user_003", "seller": "user_004", "timestamp": "2026-03-23T21:11:02Z" }
]`}

{selectedReport === "emir" && `[
  { "tradeId": "E9981", "notional": 500000, "asset": "BTC", "direction": "buy", "timestamp": "2026-03-23T20:44:01Z" },
  { "tradeId": "E9982", "notional": 120000, "asset": "ETH", "direction": "sell", "timestamp": "2026-03-23T20:45:12Z" }
]`}

{selectedReport === "aml" && `[
  { "event": "large_deposit", "user": "user_123", "amount": 250000, "timestamp": "2026-03-23T19:10:44Z" },
  { "event": "rapid_trading", "user": "user_456", "count": 142, "timestamp": "2026-03-23T19:12:01Z" }
]`}

{selectedReport === "suspicious" && `[
  { "user": "user_789", "reason": "Unusual withdrawal pattern", "timestamp": "2026-03-23T18:44:10Z" },
  { "user": "user_321", "reason": "Multiple failed KYC attempts", "timestamp": "2026-03-23T18:50:22Z" }
]`}
        </pre>


      {/* EXPORT */}
      <div className="reg-panel">
        <h2>Export</h2>

        <div className="reg-row">
          <div className="reg-item">
            <label>Format</label>
            <select>
              <option>CSV</option>
              <option>JSON</option>
              <option>XML (Regulator)</option>
            </select>


          <div className="reg-item">
            <label>Date Range</label>
            <input type="date" />


          <div className="reg-item">
            <label>&nbsp;</label>
            <input type="date" />



        <button className="reg-btn">Generate Export</button>


      {/* EXCEPTION QUEUE */}
      <div className="reg-panel">
        <h2>Exception Queue</h2>

        <table className="reg-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue</th>
              <th>Details</th>
              <th>Detected</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>EX‑1021</td>
              <td>Missing LEI</td>
              <td>user_003 has no Legal Entity Identifier</td>
              <td>2026‑03‑23</td>
              <td>
                <button className="reg-btn small">Resolve</button>
                <button className="reg-btn small danger">Dismiss</button>
              </td>
            </tr>

            <tr>
              <td>EX‑1022</td>
              <td>Invalid Notional</td>
              <td>Trade E9982 has negative notional</td>
              <td>2026‑03‑23</td>
              <td>
                <button className="reg-btn small">Resolve</button>
                <button className="reg-btn small danger">Dismiss</button>
              </td>
            </tr>
          </tbody>
        </table>


      {/* SUBMISSION HISTORY */}
      <div className="reg-panel">
        <h2>Submission History</h2>

        <ul className="reg-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — MiFID II batch submitted  
            <span className="history-meta">Status: Accepted</span>
          </li>

          <li>
            <strong>2026‑03‑22 14:44</strong> — EMIR batch submitted  
            <span className="history-meta">Status: Accepted</span>
          </li>

          <li>
            <strong>2026‑03‑20 09:12</strong> — AML log export generated  
            <span className="history-meta">Status: Completed</span>
          </li>
        </ul>



</DockablePanel>
  );
}


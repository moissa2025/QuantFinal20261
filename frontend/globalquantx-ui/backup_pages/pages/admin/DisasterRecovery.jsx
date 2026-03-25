import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function DisasterRecovery() {
  const [selectedRegion, setSelectedRegion] = useState("eu-west"    </DockablePanel>
  );

  return (
    <div className="dr-container">

      {/* HEADER */}
      <div className="dr-header">
        <h1>Disaster Recovery Console</h1>
        <p>Failover controls, backups, replicas, and recovery readiness.</p>


      {/* REGION STATUS */}
      <div className="dr-panel">
        <h2>Region Status</h2>

        <select
          className="dr-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="eu-west">EU‑West (Primary)</option>
          <option value="us-east">US‑East (Secondary)</option>
          <option value="apac">APAC (Cold Standby)</option>
        </select>

        <div className="dr-region-status">
          <p><strong>Region:</strong> {selectedRegion}</p>
          <p><strong>Health:</strong> <span className="positive">Healthy</span></p>
          <p><strong>Replication Lag:</strong> 42 ms</p>
          <p><strong>Last Sync:</strong> 2026‑03‑23 21:10</p>



      {/* FAILOVER CONTROLS */}
      <div className="dr-panel">
        <h2>Failover Controls</h2>

        <div className="dr-warning">
          <strong>Warning:</strong> Failover is a critical operation.  
          All actions are logged and require multi‑party approval.


        <button className="dr-btn danger">Initiate Failover</button>
        <button className="dr-btn">Simulate Failover (DR Drill)</button>


      {/* BACKUPS */}
      <div className="dr-panel">
        <h2>Backups & Snapshots</h2>

        <table className="dr-table">
          <thead>
            <tr>
              <th>Snapshot</th>
              <th>Created</th>
              <th>Size</th>
              <th>Region</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>snapshot_20260323_2100</td>
              <td>2026‑03‑23 21:00</td>
              <td>4.2 GB</td>
              <td>EU‑West</td>
              <td>
                <button className="dr-btn small">Restore</button>
                <button className="dr-btn small danger">Delete</button>
              </td>
            </tr>

            <tr>
              <td>snapshot_20260323_2000</td>
              <td>2026‑03‑23 20:00</td>
              <td>4.1 GB</td>
              <td>US‑East</td>
              <td>
                <button className="dr-btn small">Restore</button>
                <button className="dr-btn small danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button className="dr-btn">Create New Snapshot</button>


      {/* REPLICATION HEALTH */}
      <div className="dr-panel">
        <h2>Replication Health</h2>

        <ul className="dr-health-list">
          <li>
            EU‑West → US‑East — <span className="positive">Synchronized</span>  
            <span className="health-meta">Lag: 42 ms</span>
          </li>

          <li>
            EU‑West → APAC — <span className="warning">Behind</span>  
            <span className="health-meta">Lag: 2.4 s</span>
          </li>
        </ul>


      {/* DR DRILLS */}
      <div className="dr-panel">
        <h2>DR Drill History</h2>

        <ul className="dr-history">
          <li>
            <strong>2026‑03‑20</strong> — Full failover simulation  
            <span className="history-meta">Outcome: Success (3m 12s)</span>
          </li>

          <li>
            <strong>2026‑03‑10</strong> — Partial region isolation test  
            <span className="history-meta">Outcome: Success</span>
          </li>

          <li>
            <strong>2026‑02‑28</strong> — Backup restore validation  
            <span className="history-meta">Outcome: Success</span>
          </li>
        </ul>


      {/* AUDIT LOG */}
      <div className="dr-panel">
        <h2>DR Audit Log</h2>

        <ul className="dr-audit">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Replication lag alert acknowledged  
          </li>
          <li>
            <strong>2026‑03‑22 14:44</strong> — Snapshot created (EU‑West)  
          </li>
          <li>
            <strong>2026‑03‑20 09:12</strong> — DR drill completed  
          </li>
        </ul>



</DockablePanel>
  );
}


import { useState } from "react";

export default function Broadcast() {
  const [audience, setAudience] = useState("all");
  const [messageType, setMessageType] = useState("info");

  return (
    <div className="broadcast-container">

      {/* HEADER */}
      <div className="broadcast-header">
        <h1>Admin Broadcast Messages</h1>
        <p>Send system‑wide announcements and targeted notifications.</p>
      </div>

      {/* CREATE BROADCAST */}
      <div className="broadcast-panel">
        <h2>Create Broadcast</h2>

        <div className="broadcast-row">
          <div className="broadcast-item">
            <label>Message Title</label>
            <input type="text" placeholder="Scheduled Maintenance" />
          </div>

          <div className="broadcast-item">
            <label>Type</label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="broadcast-item">
          <label>Message Body</label>
          <textarea
            className="broadcast-textarea"
            placeholder="We will be performing scheduled maintenance on..."
          />
        </div>

        <div className="broadcast-row">
          <div className="broadcast-item">
            <label>Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="org">Specific Organization</option>
              <option value="team">Specific Team</option>
            </select>
          </div>

          {audience !== "all" && (
            <div className="broadcast-item">
              <label>{audience === "org" ? "Organization" : "Team"}</label>
              <input type="text" placeholder="Enter name…" />
            </div>
          )}
        </div>

        <div className="broadcast-row">
          <div className="broadcast-item">
            <label>Start Time</label>
            <input type="datetime-local" />
          </div>

          <div className="broadcast-item">
            <label>End Time</label>
            <input type="datetime-local" />
          </div>
        </div>

        <button className="broadcast-btn">Send Broadcast</button>
      </div>

      {/* PREVIEW */}
      <div className="broadcast-panel">
        <h2>Preview</h2>

        <div className={`broadcast-preview ${messageType}`}>
          <h3>Scheduled Maintenance</h3>
          <p>We will be performing scheduled maintenance on...</p>
        </div>
      </div>

      {/* HISTORY */}
      <div className="broadcast-panel">
        <h2>Broadcast History</h2>

        <ul className="broadcast-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Critical alert: Market data outage  
            <span className="history-meta">Audience: All Users</span>
          </li>

          <li>
            <strong>2026‑03‑20 14:44</strong> — Maintenance window scheduled  
            <span className="history-meta">Audience: Prime Fund Capital</span>
          </li>

          <li>
            <strong>2026‑03‑18 09:12</strong> — Release notes published  
            <span className="history-meta">Audience: All Users</span>
          </li>
        </ul>
      </div>

    </div>
  );
}


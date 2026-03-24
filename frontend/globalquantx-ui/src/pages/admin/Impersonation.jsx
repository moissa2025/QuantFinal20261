import { useState } from "react";

export default function Impersonation() {
  const [selectedUser, setSelectedUser] = useState("");
  const [isImpersonating, setIsImpersonating] = useState(false);

  return (
    <div className="impersonate-container">

      {/* HEADER */}
      <div className="impersonate-header">
        <h1>User Impersonation</h1>
        <p>View the platform exactly as a user sees it. Admin‑only feature.</p>
      </div>

      {/* SELECT USER */}
      {!isImpersonating && (
        <div className="impersonate-panel">
          <h2>Select User</h2>

          <div className="impersonate-item">
            <label>User Email</label>
            <input
              type="text"
              placeholder="user@example.com"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
          </div>

          <button
            className="impersonate-btn"
            disabled={!selectedUser}
            onClick={() => setIsImpersonating(true)}
          >
            Start Impersonation
          </button>
        </div>
      )}

      {/* IMPERSONATION MODE */}
      {isImpersonating && (
        <div className="impersonate-panel impersonate-active">
          <h2>Impersonation Active</h2>

          <p>
            You are currently viewing the platform as:  
            <strong>{selectedUser}</strong>
          </p>

          <div className="impersonate-warning">
            <strong>Note:</strong> Actions performed in this mode are logged for audit purposes.
          </div>

          <button
            className="impersonate-btn danger"
            onClick={() => setIsImpersonating(false)}
          >
            Exit Impersonation
          </button>
        </div>
      )}

      {/* RECENT IMPERSONATION HISTORY */}
      <div className="impersonate-panel">
        <h2>Impersonation History</h2>

        <ul className="impersonate-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Viewed as user@example.com  
            <span className="history-meta">Duration: 4m 12s</span>
          </li>

          <li>
            <strong>2026‑03‑22 14:44</strong> — Viewed as trader01@globalquantx.com  
            <span className="history-meta">Duration: 2m 51s</span>
          </li>

          <li>
            <strong>2026‑03‑20 09:12</strong> — Viewed as analyst@primefund.com  
            <span className="history-meta">Duration: 6m 03s</span>
          </li>
        </ul>
      </div>

    </div>
  );
}


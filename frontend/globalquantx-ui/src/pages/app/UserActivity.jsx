export default function UserActivity() {
  return (
    <div className="activity-container">

      {/* TOP SUMMARY */}
      <div className="activity-row">
        <div className="activity-card">
          <h3>Active Sessions</h3>
          <div className="metric">2</div>
        </div>

        <div className="activity-card">
          <h3>Last Login</h3>
          <div className="metric">2026‑03‑23 21:10</div>
        </div>

        <div className="activity-card">
          <h3>Failed Attempts (24h)</h3>
          <div className="metric warning">1</div>
        </div>

        <div className="activity-card">
          <h3>Trusted Devices</h3>
          <div className="metric">3</div>
        </div>
      </div>

      {/* SESSION HISTORY */}
      <div className="activity-panel">
        <h3>Session History</h3>

        <table className="activity-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Device</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2026‑03‑23 21:10</td>
              <td>82.14.221.10</td>
              <td>MacBook Pro</td>
              <td>London, UK</td>
              <td className="positive">Success</td>
            </tr>

            <tr>
              <td>2026‑03‑23 18:44</td>
              <td>82.14.221.10</td>
              <td>MacBook Pro</td>
              <td>London, UK</td>
              <td className="positive">Success</td>
            </tr>

            <tr>
              <td>2026‑03‑23 17:02</td>
              <td>192.168.1.22</td>
              <td>iPhone 15</td>
              <td>London, UK</td>
              <td className="warning">Failed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* DEVICE LIST */}
      <div className="activity-panel">
        <h3>Trusted Devices</h3>

        <ul className="device-list">
          <li>
            <strong>MacBook Pro</strong> — Added 2026‑02‑10  
            <span className="device-meta">IP: 82.14.221.10</span>
          </li>

          <li>
            <strong>iPhone 15</strong> — Added 2026‑01‑22  
            <span className="device-meta">IP: 192.168.1.22</span>
          </li>

          <li>
            <strong>iPad Pro</strong> — Added 2025‑12‑04  
            <span className="device-meta">IP: 82.14.221.10</span>
          </li>
        </ul>
      </div>

      {/* SECURITY EVENTS */}
      <div className="activity-panel">
        <h3>Security Events</h3>

        <ul className="event-list">
          <li className="positive">2026‑03‑23 21:10 — Login successful</li>
          <li className="warning">2026‑03‑23 17:02 — Failed login attempt</li>
          <li className="positive">2026‑03‑22 09:44 — Device verified: iPhone 15</li>
          <li className="negative">2026‑03‑20 14:12 — Password reset requested</li>
        </ul>
      </div>

    </div>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
export default function AuditLogs() {
  return (
    <div className="audit-container">

      {/* TOP SUMMARY */}
      <div className="audit-row">
        <div className="audit-card">
          <h3>Total Log Entries</h3>
          <div className="metric">12,482</div>


        <div className="audit-card">
          <h3>Last 24h</h3>
          <div className="metric">842</div>


        <div className="audit-card">
          <h3>Critical Events</h3>
          <div className="metric negative">3</div>


        <div className="audit-card">
          <h3>System Integrity</h3>
          <div className="metric positive">Verified</div>



      {/* FILTERS */}
      <div className="audit-panel">
        <h3>Filters</h3>

        <div className="audit-row">
          <div className="filter-item">
            <label>Event Type</label>
            <select>
              <option>All</option>
              <option>Authentication</option>
              <option>Order</option>
              <option>Risk</option>
              <option>System</option>
              <option>Admin</option>
            </select>


          <div className="filter-item">
            <label>Severity</label>
            <select>
              <option>All</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Critical</option>
            </select>


          <div className="filter-item">
            <label>Sort</label>
            <select>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>




      {/* AUDIT LOG TABLE */}
      <div className="audit-table">
        <h3>Audit Log</h3>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
              <th>User</th>
              <th>Severity</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2026‑03‑23 21:10:44</td>
              <td>Order Executed</td>
              <td>mohamed@example.com</td>
              <td className="positive">Info</td>
              <td>BTCUSD buy 0.50 @ 68,200</td>
            </tr>

            <tr>
              <td>2026‑03‑23 20:58:12</td>
              <td>Latency Spike</td>
              <td>system</td>
              <td className="warning">Warning</td>
              <td>Order engine latency exceeded 50ms</td>
            </tr>

            <tr>
              <td>2026‑03‑23 20:44:01</td>
              <td>Risk Threshold Breach</td>
              <td>mohamed@example.com</td>
              <td className="negative">Critical</td>
              <td>ETHUSD position exceeded configured size</td>
            </tr>

            <tr>
              <td>2026‑03‑23 19:30:55</td>
              <td>User Login</td>
              <td>mohamed@example.com</td>
              <td className="positive">Info</td>
              <td>Successful authentication</td>
            </tr>
          </tbody>
        </table>


      {/* RAW LOG STREAM */}
      <div className="audit-panel">
        <h3>Raw Log Stream</h3>

        <div className="raw-log-box">
          <pre>
{`[21:10:44] INFO     Order executed: BTCUSD buy 0.50 @ 68200
[20:58:12] WARNING  Latency spike detected: 50ms threshold exceeded
[20:44:01] CRITICAL Risk breach: ETHUSD size limit exceeded
[19:30:55] INFO     User login successful: mohamed@example.com`}
          </pre>




</DockablePanel>
  );
}


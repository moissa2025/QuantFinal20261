import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Support() {
  return (
    <div className="support-container">

      {/* TOP SUMMARY */}
      <div className="support-row">
        <div className="support-card">
          <h3>Open Tickets</h3>
          <div className="metric">2</div>


        <div className="support-card">
          <h3>Resolved (30d)</h3>
          <div className="metric positive">18</div>


        <div className="support-card">
          <h3>Avg Response Time</h3>
          <div className="metric">12 min</div>


        <div className="support-card">
          <h3>System Status</h3>
          <div className="metric positive">Operational</div>



      {/* TICKET LIST */}
      <div className="support-panel">
        <h3>Support Tickets</h3>

        <table className="support-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#1023</td>
              <td>Order not executing</td>
              <td className="warning">Pending</td>
              <td className="danger">High</td>
              <td>2026‑03‑23 19:22</td>
              <td>
                <button className="support-btn small">View</button>
              </td>
            </tr>

            <tr>
              <td>#1022</td>
              <td>Incorrect PnL display</td>
              <td className="positive">Resolved</td>
              <td className="warning">Medium</td>
              <td>2026‑03‑23 14:10</td>
              <td>
                <button className="support-btn small">View</button>
              </td>
            </tr>
          </tbody>
        </table>


      {/* CONTACT PANEL */}
      <div className="support-panel">
        <h3>Contact Support</h3>

        <div className="support-row">
          <div className="contact-item">
            <label>Email</label>
            <input type="text" value="support@globalquantx.com" readOnly />


          <div className="contact-item">
            <label>Phone</label>
            <input type="text" value="+44 20 1234 5678" readOnly />


          <div className="contact-item">
            <label>Live Chat</label>
            <button className="support-btn">Start Chat</button>




      {/* SYSTEM STATUS */}
      <div className="support-panel">
        <h3>System Status</h3>

        <ul className="status-list">
          <li>Market Stream: <span className="positive">Connected</span></li>
          <li>Order Engine: <span className="positive">Operational</span></li>
          <li>Database: <span className="positive">Healthy</span></li>
          <li>Latency: 12ms</li>
          <li>Incidents (30d): 1</li>
        </ul>


      {/* INCIDENT HISTORY */}
      <div className="support-panel">
        <h3>Incident History</h3>

        <ul className="incident-list">
          <li>2026‑03‑12 — Market stream reconnect event (resolved)</li>
          <li>2026‑02‑28 — Order engine latency spike (resolved)</li>
          <li>2026‑02‑14 — Database maintenance window</li>
        </ul>



</DockablePanel>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Admin() {
  return (
    <div className="admin-container">

      {/* TOP SUMMARY */}
      <div className="admin-row">
        <div className="admin-card">
          <h3>Total Users</h3>
          <div className="metric">42</div>


        <div className="admin-card">
          <h3>Active Sessions</h3>
          <div className="metric">7</div>


        <div className="admin-card">
          <h3>System Status</h3>
          <div className="metric positive">Operational</div>


        <div className="admin-card">
          <h3>Pending Alerts</h3>
          <div className="metric warning">3</div>



      {/* USER MANAGEMENT */}
      <div className="admin-panel">
        <h3>User Management</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Mohamed Issa</td>
              <td>mohamed@example.com</td>
              <td>Admin</td>
              <td className="positive">Active</td>
              <td>2026‑03‑23 21:10</td>
              <td>
                <button className="admin-btn small">Edit</button>
                <button className="admin-btn small danger">Disable</button>
              </td>
            </tr>

            <tr>
              <td>Sarah Patel</td>
              <td>sarah@example.com</td>
              <td>Trader</td>
              <td className="positive">Active</td>
              <td>2026‑03‑23 18:44</td>
              <td>
                <button className="admin-btn small">Edit</button>
                <button className="admin-btn small danger">Disable</button>
              </td>
            </tr>

            <tr>
              <td>James Lee</td>
              <td>james@example.com</td>
              <td>Risk</td>
              <td className="negative">Suspended</td>
              <td>2026‑03‑20 09:12</td>
              <td>
                <button className="admin-btn small">Edit</button>
                <button className="admin-btn small danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>


      {/* RISK CONFIGURATION */}
      <div className="admin-panel">
        <h3>Risk Configuration</h3>

        <div className="admin-row">
          <div className="risk-item">
            <label>Max Position Size</label>
            <input type="number" value="100000" readOnly />


          <div className="risk-item">
            <label>Max Leverage</label>
            <input type="number" value="5" readOnly />


          <div className="risk-item">
            <label>Max Daily Loss</label>
            <input type="number" value="25000" readOnly />


          <div className="risk-item">
            <label>Max Order Size</label>
            <input type="number" value="50000" readOnly />



        <button className="admin-btn">Edit Risk Settings</button>


      {/* SYSTEM HEALTH */}
      <div className="admin-panel">
        <h3>System Health</h3>

        <ul className="health-list">
          <li>Market Stream: <span className="positive">Connected</span></li>
          <li>Order Engine: <span className="positive">Operational</span></li>
          <li>Database: <span className="positive">Healthy</span></li>
          <li>Latency: 12ms</li>
          <li>API Errors (24h): 2</li>
        </ul>



</DockablePanel>
  );
}


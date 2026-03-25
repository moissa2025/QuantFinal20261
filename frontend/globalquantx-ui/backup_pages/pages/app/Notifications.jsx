import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Notifications() {
  return (
    <div className="notifications-container">

      {/* TOP SUMMARY */}
      <div className="notifications-row">
        <div className="notifications-card">
          <h3>Unread</h3>
          <div className="metric">4</div>


        <div className="notifications-card">
          <h3>System Alerts</h3>
          <div className="metric warning">1</div>


        <div className="notifications-card">
          <h3>Trade Confirmations</h3>
          <div className="metric positive">12</div>


        <div className="notifications-card">
          <h3>Risk Warnings</h3>
          <div className="metric negative">2</div>



      {/* NOTIFICATION FEED */}
      <div className="notifications-panel">
        <h3>Recent Notifications</h3>

        <ul className="notifications-list">

          <li className="notification-item positive">
            <div className="notif-title">Trade Executed</div>
            <div className="notif-body">Your BTCUSD buy order (0.50 @ 68,200) has been filled.</div>
            <div className="notif-time">2026‑03‑23 21:10</div>
          </li>

          <li className="notification-item warning">
            <div className="notif-title">High Latency Detected</div>
            <div className="notif-body">Order engine latency exceeded 50ms for 12 seconds.</div>
            <div className="notif-time">2026‑03‑23 20:58</div>
          </li>

          <li className="notification-item negative">
            <div className="notif-title">Risk Warning</div>
            <div className="notif-body">Your ETHUSD position exceeded the configured size threshold.</div>
            <div className="notif-time">2026‑03‑23 20:44</div>
          </li>

          <li className="notification-item">
            <div className="notif-title">System Message</div>
            <div className="notif-body">Scheduled maintenance will occur at 02:00 UTC.</div>
            <div className="notif-time">2026‑03‑23 19:30</div>
          </li>

        </ul>


      {/* FILTERS */}
      <div className="notifications-panel">
        <h3>Filters</h3>

        <div className="notifications-row">
          <div className="filter-item">
            <label>Type</label>
            <select>
              <option>All</option>
              <option>Trade</option>
              <option>Risk</option>
              <option>System</option>
              <option>Warning</option>
            </select>


          <div className="filter-item">
            <label>Status</label>
            <select>
              <option>All</option>
              <option>Unread</option>
              <option>Read</option>
            </select>


          <div className="filter-item">
            <label>Sort</label>
            <select>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>





</DockablePanel>
  );
}


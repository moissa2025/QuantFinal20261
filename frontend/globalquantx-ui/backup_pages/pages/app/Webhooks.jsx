import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function Webhooks() {
  const [selectedEvent, setSelectedEvent] = useState("order.executed"    </DockablePanel>
  );

  return (
    <div className="webhooks-container">

      {/* HEADER */}
      <div className="webhooks-header">
        <h1>Webhooks</h1>
        <p>Receive real‑time event notifications from GlobalQuantX.</p>


      {/* CREATE WEBHOOK */}
      <div className="webhooks-panel">
        <h2>Create Webhook</h2>

        <div className="webhooks-row">
          <div className="webhooks-item">
            <label>Endpoint URL</label>
            <input type="text" placeholder="https://your-server.com/webhook" />


          <div className="webhooks-item">
            <label>Event Type</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="order.executed">order.executed</option>
              <option value="order.rejected">order.rejected</option>
              <option value="trade.update">trade.update</option>
              <option value="balance.update">balance.update</option>
              <option value="risk.alert">risk.alert</option>
            </select>



        <button className="webhooks-btn">Add Webhook</button>


      {/* ACTIVE WEBHOOKS */}
      <div className="webhooks-panel">
        <h2>Active Webhooks</h2>

        <table className="webhooks-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Event</th>
              <th>Status</th>
              <th>Last Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>https://api.myserver.com/hook1</td>
              <td>order.executed</td>
              <td className="positive">Active</td>
              <td>2026‑03‑23 21:10</td>
              <td>
                <button className="webhooks-btn small">Test</button>
                <button className="webhooks-btn small danger">Delete</button>
              </td>
            </tr>

            <tr>
              <td>https://api.myserver.com/hook2</td>
              <td>risk.alert</td>
              <td className="warning">Retrying</td>
              <td>2026‑03‑23 20:44</td>
              <td>
                <button className="webhooks-btn small">Test</button>
                <button className="webhooks-btn small danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>


      {/* DELIVERY LOGS */}
      <div className="webhooks-panel">
        <h2>Delivery Logs</h2>

        <ul className="delivery-list">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Delivered  
            <span className="log-meta">order.executed → 200 OK</span>
          </li>

          <li>
            <strong>2026‑03‑23 20:44</strong> — Failed  
            <span className="log-meta">risk.alert → 500 Server Error</span>
          </li>

          <li>
            <strong>2026‑03‑23 20:12</strong> — Delivered  
            <span className="log-meta">trade.update → 200 OK</span>
          </li>
        </ul>


      {/* SAMPLE PAYLOAD */}
      <div className="webhooks-panel">
        <h2>Sample Payload</h2>

        <pre className="webhooks-payload">
{`{
  "event": "order.executed",
  "timestamp": "2026-03-23T21:10:44Z",
  "data": {
    "symbol": "BTCUSD",
    "side": "buy",
    "size": 0.50,
    "price": 68200,
    "orderId": "order_12345"
  }
}`}
        </pre>



</DockablePanel>
  );
}


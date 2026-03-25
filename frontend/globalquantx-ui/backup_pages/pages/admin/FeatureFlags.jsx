import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function FeatureFlags() {
  const [selectedFlag, setSelectedFlag] = useState("new_trading_ui"    </DockablePanel>
  );

  const flags = {
    new_trading_ui: {
      name: "New Trading UI",
      description: "Enables the redesigned trading terminal.",
      status: "enabled",
      rollout: 75
    },
    risk_engine_v2: {
      name: "Risk Engine v2",
      description: "Activates the new risk calculation pipeline.",
      status: "disabled",
      rollout: 0
    },
    websocket_fastpath: {
      name: "WebSocket Fast‑Path",
      description: "Routes market data through the low‑latency gateway.",
      status: "enabled",
      rollout: 100
    }
  };

  const flag = flags[selectedFlag];

  return (
    <div className="flags-container">

      {/* HEADER */}
      <div className="flags-header">
        <h1>Feature Flags & Experiments</h1>
        <p>Control rollouts, experiments, and feature toggles across the platform.</p>


      {/* FLAG SELECTOR */}
      <div className="flags-panel">
        <h2>Select Feature Flag</h2>

        <select
          className="flags-select"
          value={selectedFlag}
          onChange={(e) => setSelectedFlag(e.target.value)}
        >
          {Object.keys(flags).map((key) => (
            <option key={key} value={key}>
              {flags[key].name}
            </option>
          ))}
        </select>


      {/* FLAG DETAILS */}
      <div className="flags-panel">
        <h2>Flag Details</h2>

        <p><strong>Name:</strong> {flag.name}</p>
        <p><strong>Description:</strong> {flag.description}</p>

        <div className="flags-row">
          <div className="flags-item">
            <label>Status</label>
            <select defaultValue={flag.status}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>


          <div className="flags-item">
            <label>Rollout %</label>
            <input type="range" min="0" max="100" defaultValue={flag.rollout} />
            <span className="rollout-value">{flag.rollout}%</span>



        <button className="flags-btn">Save Changes</button>


      {/* TARGETING RULES */}
      <div className="flags-panel">
        <h2>Targeting Rules</h2>

        <ul className="rules-list">
          <li>
            <strong>Prime Fund Capital</strong> — Enabled  
          </li>
          <li>
            <strong>NorthBridge Investments</strong> — 50% rollout  
          </li>
          <li>
            <strong>Apex Quant Group</strong> — Disabled  
          </li>
        </ul>

        <button className="flags-btn">Edit Rules</button>


      {/* EXPERIMENTS */}
      <div className="flags-panel">
        <h2>Experiments</h2>

        <table className="flags-table">
          <thead>
            <tr>
              <th>Experiment</th>
              <th>Variant A</th>
              <th>Variant B</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Trading UI Layout Test</td>
              <td>50%</td>
              <td>50%</td>
              <td className="positive">Running</td>
            </tr>

            <tr>
              <td>Order Ticket Redesign</td>
              <td>80%</td>
              <td>20%</td>
              <td className="warning">Paused</td>
            </tr>
          </tbody>
        </table>

        <button className="flags-btn">Create Experiment</button>


      {/* HISTORY */}
      <div className="flags-panel">
        <h2>Flag Change History</h2>

        <ul className="flags-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Enabled “New Trading UI” for 75% rollout  
          </li>
          <li>
            <strong>2026‑03‑22 14:44</strong> — Created experiment “Order Ticket Redesign”  
          </li>
          <li>
            <strong>2026‑03‑20 09:12</strong> — Disabled “Risk Engine v2”  
          </li>
        </ul>



</DockablePanel>
  );
}


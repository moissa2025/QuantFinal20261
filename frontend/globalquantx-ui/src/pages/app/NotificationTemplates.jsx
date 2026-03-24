import { useState } from "react";

export default function NotificationTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState("order.executed");

  const templates = {
    "order.executed": {
      title: "Order Executed",
      body: "Your order for {{symbol}} ({{side}} {{size}} @ {{price}}) has been executed."
    },
    "order.rejected": {
      title: "Order Rejected",
      body: "Your order for {{symbol}} was rejected. Reason: {{reason}}."
    },
    "risk.alert": {
      title: "Risk Alert",
      body: "A risk threshold has been triggered for {{symbol}}. Details: {{details}}."
    },
    "balance.update": {
      title: "Balance Update",
      body: "Your account balance has changed. New balance: {{balance}}."
    }
  };

  const template = templates[selectedTemplate];

  return (
    <div className="templates-container">

      {/* HEADER */}
      <div className="templates-header">
        <h1>Notification Templates</h1>
        <p>Manage system and email templates used across the platform.</p>
      </div>

      {/* TEMPLATE SELECTOR */}
      <div className="templates-panel">
        <h2>Select Template</h2>

        <select
          className="templates-select"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="order.executed">Order Executed</option>
          <option value="order.rejected">Order Rejected</option>
          <option value="risk.alert">Risk Alert</option>
          <option value="balance.update">Balance Update</option>
        </select>
      </div>

      {/* TEMPLATE EDITOR */}
      <div className="templates-panel">
        <h2>Template Editor</h2>

        <div className="templates-item">
          <label>Title</label>
          <input type="text" value={template.title} readOnly />
        </div>

        <div className="templates-item">
          <label>Body</label>
          <textarea
            className="templates-textarea"
            value={template.body}
            readOnly
          />
        </div>

        <button className="templates-btn">Edit Template</button>
      </div>

      {/* PLACEHOLDERS */}
      <div className="templates-panel">
        <h2>Available Placeholders</h2>

        <ul className="placeholder-list">
          <li><code>{{`{{symbol}}`}}</code> — Asset symbol</li>
          <li><code>{{`{{side}}`}}</code> — buy/sell</li>
          <li><code>{{`{{size}}`}}</code> — Order size</li>
          <li><code>{{`{{price}}`}}</code> — Execution price</li>
          <li><code>{{`{{reason}}`}}</code> — Rejection reason</li>
          <li><code>{{`{{details}}`}}</code> — Risk alert details</li>
          <li><code>{{`{{balance}}`}}</code> — Updated balance</li>
        </ul>
      </div>

      {/* PREVIEW */}
      <div className="templates-panel">
        <h2>Preview</h2>

        <div className="preview-box">
          <h3>{template.title}</h3>
          <p>{template.body}</p>
        </div>
      </div>

      {/* VERSION HISTORY */}
      <div className="templates-panel">
        <h2>Version History</h2>

        <ul className="history-list">
          <li>2026‑03‑22 — Updated “Order Executed” template</li>
          <li>2026‑03‑18 — Added “Risk Alert” template</li>
          <li>2026‑03‑10 — Initial template set created</li>
        </ul>
      </div>

    </div>
  );
}


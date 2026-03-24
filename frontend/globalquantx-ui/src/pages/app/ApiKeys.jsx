import { useState } from "react";

export default function ApiKeys() {
  const [selectedScopes, setSelectedScopes] = useState({
    trading: true,
    readOnly: false,
    marketData: true,
    account: false,
    webhooks: false
  });

  function toggleScope(scope) {
    setSelectedScopes({
      ...selectedScopes,
      [scope]: !selectedScopes[scope]
    });
  }

  return (
    <div className="keys-container">

      {/* HEADER */}
      <div className="keys-header">
        <h1>API Keys</h1>
        <p>Manage API keys, permissions, and access scopes.</p>
      </div>

      {/* CREATE KEY */}
      <div className="keys-panel">
        <h2>Create New API Key</h2>

        <div className="keys-row">
          <div className="keys-item">
            <label>Key Name</label>
            <input type="text" placeholder="My Trading Bot" />
          </div>
        </div>

        <h3>Scopes</h3>

        <div className="scopes-grid">
          <label className="scope-option">
            <input
              type="checkbox"
              checked={selectedScopes.trading}
              onChange={() => toggleScope("trading")}
            />
            Trading (place & cancel orders)
          </label>

          <label className="scope-option">
            <input
              type="checkbox"
              checked={selectedScopes.readOnly}
              onChange={() => toggleScope("readOnly")}
            />
            Read‑only (no trading)
          </label>

          <label className="scope-option">
            <input
              type="checkbox"
              checked={selectedScopes.marketData}
              onChange={() => toggleScope("marketData")}
            />
            Market Data (REST & WebSocket)
          </label>

          <label className="scope-option">
            <input
              type="checkbox"
              checked={selectedScopes.account}
              onChange={() => toggleScope("account")}
            />
            Account Info (balances, positions)
          </label>

          <label className="scope-option">
            <input
              type="checkbox"
              checked={selectedScopes.webhooks}
              onChange={() => toggleScope("webhooks")}
            />
            Webhook Management
          </label>
        </div>

        <button className="keys-btn">Generate API Key</button>
      </div>

      {/* ACTIVE KEYS */}
      <div className="keys-panel">
        <h2>Active Keys</h2>

        <table className="keys-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Scopes</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Trading Bot</td>
              <td>pk_live_xxxx1234</td>
              <td>trading, marketData</td>
              <td>2026‑03‑20</td>
              <td>
                <button className="keys-btn small">Rotate</button>
                <button className="keys-btn small danger">Revoke</button>
              </td>
            </tr>

            <tr>
              <td>Analytics</td>
              <td>pk_live_xxxx9876</td>
              <td>readOnly, marketData</td>
              <td>2026‑02‑14</td>
              <td>
                <button className="keys-btn small">Rotate</button>
                <button className="keys-btn small danger">Revoke</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* KEY HISTORY */}
      <div className="keys-panel">
        <h2>Key Activity Log</h2>

        <ul className="keys-log">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Trading Bot key used for order placement
          </li>
          <li>
            <strong>2026‑03‑23 20:44</strong> — Analytics key fetched market data
          </li>
          <li>
            <strong>2026‑03‑22 11:12</strong> — Trading Bot key rotated
          </li>
        </ul>
      </div>

    </div>
  );
}


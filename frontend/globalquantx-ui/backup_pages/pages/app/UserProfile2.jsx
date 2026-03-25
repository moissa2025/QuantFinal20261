import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function UserProfile2() {
  const [selectedTab, setSelectedTab] = useState("sessions"    </DockablePanel>
  );

  return (
    <div className="profile2-container">

      {/* HEADER */}
      <div className="profile2-header">
        <h1>User Profile</h1>
        <p>Manage your identity, sessions, tokens, and security keys.</p>


      {/* TABS */}
      <div className="profile2-tabs">
        <button
          className={selectedTab === "sessions" ? "active" : ""}
          onClick={() => setSelectedTab("sessions")}
        >
          Sessions
        </button>

        <button
          className={selectedTab === "tokens" ? "active" : ""}
          onClick={() => setSelectedTab("tokens")}
        >
          Tokens
        </button>

        <button
          className={selectedTab === "keys" ? "active" : ""}
          onClick={() => setSelectedTab("keys")}
        >
          Security Keys
        </button>


      {/* SESSIONS TAB */}
      {selectedTab === "sessions" && (
        <div className="profile2-panel">
          <h2>Active Sessions</h2>

          <table className="profile2-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>IP</th>
                <th>Location</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>MacBook Pro</td>
                <td>82.14.221.10</td>
                <td>London, UK</td>
                <td>2026‑03‑23 21:10</td>
                <td>
                  <button className="profile2-btn small danger">Terminate</button>
                </td>
              </tr>

              <tr>
                <td>iPhone 15</td>
                <td>192.168.1.22</td>
                <td>London, UK</td>
                <td>2026‑03‑23 18:44</td>
                <td>
                  <button className="profile2-btn small danger">Terminate</button>
                </td>
              </tr>
            </tbody>
          </table>

      )}

      {/* TOKENS TAB */}
      {selectedTab === "tokens" && (
        <div className="profile2-panel">
          <h2>Access Tokens</h2>

          <table className="profile2-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>token_xxxx1234</td>
                <td>2026‑03‑20</td>
                <td>2026‑03‑23 21:10</td>
                <td className="positive">Active</td>
                <td>
                  <button className="profile2-btn small">Rotate</button>
                  <button className="profile2-btn small danger">Revoke</button>
                </td>
              </tr>

              <tr>
                <td>token_xxxx9876</td>
                <td>2026‑02‑14</td>
                <td>2026‑03‑22 09:44</td>
                <td className="warning">Expiring</td>
                <td>
                  <button className="profile2-btn small">Rotate</button>
                  <button className="profile2-btn small danger">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>

          <button className="profile2-btn">Generate New Token</button>

      )}

      {/* SECURITY KEYS TAB */}
      {selectedTab === "keys" && (
        <div className="profile2-panel">
          <h2>Security Keys</h2>

          <ul className="profile2-keylist">
            <li>
              <strong>YubiKey 5 NFC</strong> — Added 2026‑02‑10  
              <span className="key-meta">Last used: 2026‑03‑23 21:10</span>
              <button className="profile2-btn small danger">Remove</button>
            </li>

            <li>
              <strong>MacBook Touch ID</strong> — Added 2026‑01‑22  
              <span className="key-meta">Last used: 2026‑03‑23 18:44</span>
              <button className="profile2-btn small danger">Remove</button>
            </li>
          </ul>

          <button className="profile2-btn">Add Security Key</button>

      )}

</DockablePanel>
  );
}


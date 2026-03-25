import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MultiTenant() {
  const [selectedOrg, setSelectedOrg] = useState("Prime Fund Capital"    </DockablePanel>
  );
  const [selectedTeam, setSelectedTeam] = useState("Trading Desk"    </DockablePanel>
  );

  const orgs = [
    "Prime Fund Capital",
    "NorthBridge Investments",
    "Apex Quant Group"
  ];

  const teams = {
    "Prime Fund Capital": ["Trading Desk", "Risk Team", "Operations"],
    "NorthBridge Investments": ["Execution", "Compliance"],
    "Apex Quant Group": ["Research", "Trading", "DevOps"]
  };

  return (
    <div className="tenant-container">

      {/* HEADER */}
      <div className="tenant-header">
        <h1>Multi‑Tenant Management</h1>
        <p>Manage organizations, teams, roles, and permissions.</p>


      {/* ORGANIZATION SELECTOR */}
      <div className="tenant-panel">
        <h2>Select Organization</h2>

        <select
          className="tenant-select"
          value={selectedOrg}
          onChange={(e) => {
            setSelectedOrg(e.target.value    </DockablePanel>
  );
            setSelectedTeam(teams[e.target.value][0]    </DockablePanel>
  );
          }}
        >
          {orgs.map((org) => (
            <option key={org}>{org}</option>
          ))}
        </select>


      {/* ORG DETAILS */}
      <div className="tenant-panel">
        <h2>Organization Details</h2>

        <p><strong>Name:</strong> {selectedOrg}</p>
        <p><strong>Members:</strong> 42</p>
        <p><strong>Teams:</strong> {teams[selectedOrg].length}</p>

        <button className="tenant-btn">Edit Organization</button>


      {/* TEAM SELECTOR */}
      <div className="tenant-panel">
        <h2>Teams</h2>

        <select
          className="tenant-select"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          {teams[selectedOrg].map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>


      {/* TEAM MEMBERS */}
      <div className="tenant-panel">
        <h2>{selectedTeam} — Members</h2>

        <table className="tenant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Sarah Mitchell</td>
              <td>sarah@primefund.com</td>
              <td>Trader</td>
              <td>Trading, Market Data</td>
              <td>
                <button className="tenant-btn small">Edit</button>
                <button className="tenant-btn small danger">Remove</button>
              </td>
            </tr>

            <tr>
              <td>James Carter</td>
              <td>jcarter@primefund.com</td>
              <td>Risk Analyst</td>
              <td>Risk, Read‑Only</td>
              <td>
                <button className="tenant-btn small">Edit</button>
                <button className="tenant-btn small danger">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button className="tenant-btn">Add Member</button>


      {/* ROLE MATRIX */}
      <div className="tenant-panel">
        <h2>Role & Permission Matrix</h2>

        <table className="tenant-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Trading</th>
              <th>Market Data</th>
              <th>Risk</th>
              <th>Admin</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Trader</td>
              <td className="positive">✔</td>
              <td className="positive">✔</td>
              <td>—</td>
              <td>—</td>
            </tr>

            <tr>
              <td>Risk Analyst</td>
              <td>—</td>
              <td className="positive">✔</td>
              <td className="positive">✔</td>
              <td>—</td>
            </tr>

            <tr>
              <td>Org Admin</td>
              <td className="positive">✔</td>
              <td className="positive">✔</td>
              <td className="positive">✔</td>
              <td className="positive">✔</td>
            </tr>
          </tbody>
        </table>


      {/* AUDIT TRAIL */}
      <div className="tenant-panel">
        <h2>Tenant Audit Log</h2>

        <ul className="tenant-log">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Added user to Trading Desk  
          </li>
          <li>
            <strong>2026‑03‑22 14:44</strong> — Updated role: Risk Analyst → Trader  
          </li>
          <li>
            <strong>2026‑03‑20 09:12</strong> — Created new team: Operations  
          </li>
        </ul>



</DockablePanel>
  );
}


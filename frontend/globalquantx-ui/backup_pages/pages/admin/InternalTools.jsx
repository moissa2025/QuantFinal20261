import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function InternalTools() {
  const [selectedTool, setSelectedTool] = useState("cache_reset"    </DockablePanel>
  );

  const tools = {
    cache_reset: {
      name: "Cache Reset",
      description: "Clears in‑memory caches across all services.",
      params: ["Service Name"]
    },
    queue_drain: {
      name: "Queue Drain",
      description: "Drains a message queue safely.",
      params: ["Queue Name"]
    },
    backfill_trades: {
      name: "Backfill Trades",
      description: "Rebuilds trade history for a given user or symbol.",
      params: ["User ID", "Symbol"]
    },
    reconcile_balances: {
      name: "Reconcile Balances",
      description: "Runs a balance reconciliation job.",
      params: ["User ID"]
    },
    regenerate_reports: {
      name: "Regenerate Reports",
      description: "Rebuilds daily/weekly/monthly reports.",
      params: ["Report Type", "Date"]
    }
  };

  const tool = tools[selectedTool];

  return (
    <div className="tools-container">

      {/* HEADER */}
      <div className="tools-header">
        <h1>Internal Tools Hub</h1>
        <p>Run maintenance jobs, scripts, and operational tasks.</p>


      {/* TOOL SELECTOR */}
      <div className="tools-panel">
        <h2>Select Tool</h2>

        <select
          className="tools-select"
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
        >
          {Object.keys(tools).map((key) => (
            <option key={key} value={key}>
              {tools[key].name}
            </option>
          ))}
        </select>


      {/* TOOL DETAILS */}
      <div className="tools-panel">
        <h2>Tool Details</h2>

        <p><strong>Name:</strong> {tool.name}</p>
        <p><strong>Description:</strong> {tool.description}</p>

        <h3>Parameters</h3>

        {tool.params.map((param) => (
          <div className="tools-item" key={param}>
            <label>{param}</label>
            <input type="text" placeholder={`Enter ${param}…`} />

        ))}

        <button className="tools-btn danger">Run Tool</button>


      {/* OUTPUT LOG */}
      <div className="tools-panel">
        <h2>Execution Output</h2>

        <pre className="tools-output">
{`[21:10:44] Starting job: ${tool.name}
[21:10:45] Validating parameters…
[21:10:46] Executing…
[21:10:48] Completed successfully.`}
        </pre>


      {/* HISTORY */}
      <div className="tools-panel">
        <h2>Execution History</h2>

        <ul className="tools-history">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Cache Reset (market‑data)  
          </li>
          <li>
            <strong>2026‑03‑22 14:44</strong> — Queue Drain (orders‑pending)  
          </li>
          <li>
            <strong>2026‑03‑20 09:12</strong> — Backfill Trades (user_123, BTCUSD)  
          </li>
        </ul>



</DockablePanel>
  );
}


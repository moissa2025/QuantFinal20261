import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function AlphaMap() {
  const [signal, setSignal] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="dc-container">

      <div className="dc-header">
        <h1>Multi‑Asset Alpha Map</h1>
        <p>Signal landscape, alpha strength, and diagnostics.</p>


      {/* SIGNAL SELECTOR */}
      <div className="dc-panel">
        <h2>Select Signal</h2>

        <select className="dc-select" value={signal} onChange={(e) => setSignal(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="carry">Carry</option>
          <option value="value">Value</option>
          <option value="vol">Volatility</option>
        </select>


      {/* ALPHA SNAPSHOT */}
      <div className="dc-panel">
        <h2>Alpha Snapshot</h2>

        <pre className="dc-block">
{`BTC Alpha:        +0.8%
ETH Alpha:        +0.6%
SOL Alpha:        +1.2%
Gold Alpha:       +0.3%`}
        </pre>


      {/* HEATMAP */}
      <div className="dc-panel">
        <h2>Alpha Heatmap</h2>

        <pre className="dc-block">
{`Momentum:          ████████████████
Carry:              ███████████
Value:              ███████
Volatility:         █████████████`}
        </pre>


      {/* LOG */}
      <div className="dc-panel">
        <h2>Alpha Map Log</h2>

        <ul className="dc-log">
          <li>Signal selected</li>
          <li>Alpha computed</li>
          <li>Heatmap updated</li>
        </ul>



</DockablePanel>
  );
}


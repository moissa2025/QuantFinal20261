import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionFootprint() {
  const [size, setSize] = useState("1.0"    </DockablePanel>
  );

  return (
    <div className="ef-container">

      <div className="ef-header">
        <h1>Execution Footprint Analyzer</h1>
        <p>Market‑impact footprint, scaling, and execution diagnostics.</p>


      {/* INPUT */}
      <div className="ef-panel">
        <h2>Order Size</h2>

        <input
          className="ef-input"
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />


      {/* FOOTPRINT */}
      <div className="ef-panel">
        <h2>Impact Footprint</h2>

        <pre className="ef-block">
{`Size (BTC)   Impact ($)
────────────────────────
0.1           1.20
0.5           4.80
1.0           12.40
2.0           38.50`}
        </pre>


      {/* HEATMAP */}
      <div className="ef-panel">
        <h2>Footprint Heatmap</h2>

        <pre className="ef-block">
{`Low Impact:      ████████████████
Medium Impact:    █████████
High Impact:      █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="ef-panel">
        <h2>Footprint Log</h2>

        <ul className="ef-log">
          <li>Size parsed</li>
          <li>Impact curve loaded</li>
          <li>Footprint computed</li>
        </ul>



</DockablePanel>
  );
}


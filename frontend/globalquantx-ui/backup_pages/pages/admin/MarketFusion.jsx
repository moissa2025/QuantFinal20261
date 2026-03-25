import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MarketFusion() {
  const [layer, setLayer] = useState("macro"    </DockablePanel>
  );

  return (
    <div className="db-container">

      <div className="db-header">
        <h1>Global Market Fusion Engine</h1>
        <p>Macro + micro + execution fusion diagnostics.</p>


      {/* LAYER SELECTOR */}
      <div className="db-panel">
        <h2>Select Fusion Layer</h2>

        <select className="db-select" value={layer} onChange={(e) => setLayer(e.target.value)}>
          <option value="macro">Macro</option>
          <option value="micro">Microstructure</option>
          <option value="execution">Execution</option>
        </select>


      {/* FUSION DETAILS */}
      <div className="db-panel">
        <h2>Fusion Details</h2>

        <pre className="db-block">
{layer === "macro" && `Growth: Rising
Inflation: Elevated
Liquidity: Tightening
Fusion Score: 68%`}

{layer === "micro" && `Volatility: Elevated
Depth: Stable
Spread: Narrow
Fusion Score: 74%`}

{layer === "execution" && `Impact: Low
Latency: Low
Fill Quality: High
Fusion Score: 82%`}
        </pre>


      {/* HEATMAP */}
      <div className="db-panel">
        <h2>Fusion Heatmap</h2>

        <pre className="db-block">
{`Macro Fusion:        ███████████
Micro Fusion:        ████████████████
Execution Fusion:    █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="db-panel">
        <h2>Fusion Log</h2>

        <ul className="db-log">
          <li>Fusion layer updated</li>
          <li>Fusion score computed</li>
          <li>Heatmap refreshed</li>
        </ul>



</DockablePanel>
  );
}


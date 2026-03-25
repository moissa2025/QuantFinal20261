import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MacroEarlyWarning() {
  const [region, setRegion] = useState("Global"    </DockablePanel>
  );

  return (
    <div className="mew-container">

      <div className="mew-header">
        <h1>Global Macro Early‑Warning System</h1>
        <p>Fragility, macro signals, and early‑warning diagnostics.</p>


      {/* REGION SELECTOR */}
      <div className="mew-panel">
        <h2>Select Region</h2>

        <select className="mew-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option>Global</option>
          <option>US</option>
          <option>EU</option>
          <option>Asia</option>
        </select>


      {/* SIGNALS */}
      <div className="mew-panel">
        <h2>Early‑Warning Signals</h2>

        <pre className="mew-block">
{`Growth Fragility:       58%
Inflation Pressure:      72%
Liquidity Stress:        64%
Financial Conditions:    Tightening`}
        </pre>


      {/* HEATMAP */}
      <div className="mew-panel">
        <h2>Macro Stress Heatmap</h2>

        <pre className="mew-block">
{`Growth Stress:        ███████████
Inflation Stress:      ████████████████████
Liquidity Stress:      ███████████████`}
        </pre>


      {/* LOG */}
      <div className="mew-panel">
        <h2>Early‑Warning Log</h2>

        <ul className="mew-log">
          <li>Inflation pressure rising</li>
          <li>Liquidity stress elevated</li>
          <li>Growth fragility detected</li>
        </ul>



</DockablePanel>
  );
}


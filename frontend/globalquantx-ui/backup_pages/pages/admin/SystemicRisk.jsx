import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function SystemicRisk() {
  const [region, setRegion] = useState("Global"    </DockablePanel>
  );

  return (
    <div className="srx-container">

      <div className="srx-header">
        <h1>Global Systemic Risk Radar</h1>
        <p>Cross‑asset fragility, contagion, and systemic stress.</p>


      {/* REGION SELECTOR */}
      <div className="srx-panel">
        <h2>Select Region</h2>

        <select className="srx-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option>Global</option>
          <option>US</option>
          <option>EU</option>
          <option>Asia</option>
        </select>


      {/* SYSTEMIC INDICATORS */}
      <div className="srx-panel">
        <h2>Systemic Indicators</h2>

        <pre className="srx-block">
{`Fragility Index:        62%
Contagion Risk:         48%
Liquidity Stress:        55%
Volatility Stress:       71%`}
        </pre>


      {/* HEATMAP */}
      <div className="srx-panel">
        <h2>Systemic Heatmap</h2>

        <pre className="srx-block">
{`Crypto Cluster:     ████████████████████
Equities:            ███████████
Rates:               ███████
Commodities:         █████████████`}
        </pre>


      {/* LOG */}
      <div className="srx-panel">
        <h2>Systemic Risk Log</h2>

        <ul className="srx-log">
          <li>Volatility stress elevated</li>
          <li>Cross‑asset contagion rising</li>
          <li>Fragility cluster detected</li>
        </ul>



</DockablePanel>
  );
}


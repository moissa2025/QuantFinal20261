import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionRisk() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="er2-container">

      <div className="er2-header">
        <h1>Execution‑Risk Heatmap</h1>
        <p>Venue fragility, slippage risk, and execution diagnostics.</p>


      {/* SYMBOL SELECTOR */}
      <div className="er2-panel">
        <h2>Select Market</h2>

        <select className="er2-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>


      {/* HEATMAP */}
      <div className="er2-panel">
        <h2>Execution‑Risk Heatmap</h2>

        <pre className="er2-block">
{`Venue A   ████████████████   (Low Risk)
Venue B   █████████           (Medium Risk)
Venue C   ██████████████████████████   (High Risk)`}
        </pre>


      {/* DIAGNOSTICS */}
      <div className="er2-panel">
        <h2>Venue Diagnostics</h2>

        <pre className="er2-block">
{`Venue A:  Latency 12ms, Spread 0.003%, Depth High
Venue B:  Latency 18ms, Spread 0.006%, Depth Medium
Venue C:  Latency 25ms, Spread 0.012%, Depth Low`}
        </pre>


      {/* LOG */}
      <div className="er2-panel">
        <h2>Execution‑Risk Log</h2>

        <ul className="er2-log">
          <li>Venue C fragility elevated</li>
          <li>Slippage risk rising</li>
          <li>Latency divergence detected</li>
        </ul>



</DockablePanel>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LiquidityFragmentation() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="lf-container">

      <div className="lf-header">
        <h1>Liquidity Fragmentation Monitor</h1>
        <p>Depth divergence, spread fragmentation, and venue‑level liquidity cracks.</p>


      {/* SYMBOL SELECTOR */}
      <div className="lf-panel">
        <h2>Select Market</h2>

        <select className="lf-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>


      {/* FRAGMENTATION HEATMAP */}
      <div className="lf-panel">
        <h2>Fragmentation Heatmap</h2>

        <pre className="lf-block">
{`Venue A   ████████████████   (Low Fragmentation)
Venue B   █████████           (Medium Fragmentation)
Venue C   ██████████████████████████   (High Fragmentation)`}
        </pre>


      {/* DIAGNOSTICS */}
      <div className="lf-panel">
        <h2>Fragmentation Diagnostics</h2>

        <pre className="lf-block">
{`Depth Divergence:     38%
Spread Divergence:     22%
Latency Divergence:    41%`}
        </pre>


      {/* LOG */}
      <div className="lf-panel">
        <h2>Fragmentation Log</h2>

        <ul className="lf-log">
          <li>Venue C depth collapse detected</li>
          <li>Spread fragmentation rising</li>
          <li>Latency divergence widening</li>
        </ul>



</DockablePanel>
  );
}


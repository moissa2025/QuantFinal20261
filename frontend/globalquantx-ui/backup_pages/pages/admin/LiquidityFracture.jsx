import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LiquidityFracture() {
  const [market, setMarket] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="dj-container">

      <div className="dj-header">
        <h1>Global Liquidity Fracture Detector</h1>
        <p>Fragmentation, stress cracks, and liquidity diagnostics.</p>


      <div className="dj-panel">
        <h2>Select Market</h2>
        <select className="dj-select" value={market} onChange={(e) => setMarket(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>

           <div className="dj-panel">
        <h2>Fracture Diagnostics</h2>
        <pre className="dj-block">
{`Fragmentation:       62%
Depth Divergence:     48%
Spread Instability:   71%`}
        </pre>


      <div className="dj-panel">
        <h2>Fracture Log</h2>
        <ul className="dj-log">
          <li>Fragmentation detected</li>
          <li>Depth divergence rising</li>
          <li>Liquidity fracture flagged</li>
        </ul>



</DockablePanel>
  );
}


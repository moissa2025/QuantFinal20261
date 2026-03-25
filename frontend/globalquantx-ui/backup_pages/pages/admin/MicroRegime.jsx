import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MicroRegime() {
  const [asset, setAsset] = useState("BTC"    </DockablePanel>
  );

  return (
    <div className="cs-container">

      <div className="cs-header">
        <h1>Global Market Micro‑Regime Engine</h1>
        <p>Micro‑volatility, micro‑liquidity, and micro‑trend diagnostics.</p>


      {/* ASSET SELECTOR */}
      <div className="cs-panel">
        <h2>Select Asset</h2>

        <select className="cs-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>Gold</option>
          <option>SP500</option>
        </select>


      {/* MICRO-REGIME */}
      <div className="cs-panel">
        <h2>Micro‑Regime</h2>

        <pre className="cs-block">
{`Volatility:       Elevated
Liquidity:         Stable
Micro‑Trend:       Up
Regime:            Micro‑Expansion`}
        </pre>


      {/* HEATMAP */}
      <div className="cs-panel">
        <h2>Micro‑Regime Heatmap</h2>

        <pre className="cs-block">
{`Volatility:        ████████████████
Liquidity:          ███████████
Micro‑Trend:        █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="cs-panel">
        <h2>Micro‑Regime Log</h2>

        <ul className="cs-log">
          <li>Micro‑volatility spike detected</li>
          <li>Micro‑trend strengthening</li>
          <li>Liquidity stable</li>
        </ul>



</DockablePanel>
  );
}


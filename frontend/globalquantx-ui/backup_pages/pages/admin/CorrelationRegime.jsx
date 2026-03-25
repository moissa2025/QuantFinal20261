import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function CorrelationRegime() {
  const [regime, setRegime] = useState("normal"    </DockablePanel>
  );

  return (
    <div className="cr-container">

      <div className="cr-header">
        <h1>Multi‑Asset Correlation Regime Engine</h1>
        <p>Correlation breakdown, tail correlation, and regime diagnostics.</p>


      {/* REGIME SELECTOR */}
      <div className="cr-panel">
        <h2>Select Regime</h2>

        <select className="cr-select" value={regime} onChange={(e) => setRegime(e.target.value)}>
          <option value="normal">Normal Regime</option>
          <option value="stress">Stress Regime</option>
          <option value="dislocated">Dislocated Regime</option>
        </select>


      {/* MATRIX */}
      <div className="cr-panel">
        <h2>Correlation Matrix</h2>

        <pre className="cr-block">
{`          BTC   ETH   SOL   Gold   Bonds
BTC       1.00  0.62  0.48  0.12   -0.08
ETH       0.62  1.00  0.55  0.10   -0.12
SOL       0.48  0.55  1.00  0.08   -0.18
Gold      0.12  0.10  0.08  1.00    0.42
Bonds    -0.08 -0.12 -0.18  0.42    1.00`}
        </pre>


      {/* HEATMAP */}
      <div className="cr-panel">
        <h2>Correlation Heatmap</h2>

        <pre className="cr-block">
{`Crypto Cluster:     ████████████████
Safe Havens:         ███████
Tail Correlation:    █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="cr-panel">
        <h2>Correlation Regime Log</h2>

        <ul className="cr-log">
          <li>Regime selected</li>
          <li>Correlation matrix updated</li>
          <li>Tail correlation computed</li>
        </ul>



</DockablePanel>
  );
}


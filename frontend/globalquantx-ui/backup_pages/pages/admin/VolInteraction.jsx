import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function VolInteraction() {
  const [asset, setAsset] = useState("BTC"    </DockablePanel>
  );

  return (
    <div className="di-container">

      <div className="di-header">
        <h1>Multi‑Asset Volatility Interaction Engine</h1>
        <p>Vol spillover, contagion, and interaction diagnostics.</p>


      <div className="di-panel">
        <h2>Select Base Asset</h2>
        <select className="di-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>


      <div className="di-panel">
        <h2>Vol Interaction</h2>
        <pre className="di-block">
{`BTC → ETH:      0.62
BTC → SOL:      0.48
ETH → SOL:      0.55`}
        </pre>


      <div className="di-panel">
        <h2>Interaction Heatmap</h2>
        <pre className="di-block">
{`Spillover:          ████████████████
Contagion:           ███████████
Vol Stress:          █████████████████████`}
        </pre>


      <div className="di-panel">
        <h2>Interaction Log</h2>
        <ul className="di-log">
          <li>Vol matrix computed</li>
          <li>Spillover estimated</li>
          <li>Heatmap updated</li>
        </ul>



</DockablePanel>
  );
}


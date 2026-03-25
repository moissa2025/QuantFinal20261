import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function AlphaDecaySurface() {
  const [signal, setSignal] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="df-container">

      <div className="df-header">
        <h1>Multi‑Asset Alpha Decay Surface</h1>
        <p>Decay curves, half‑life surfaces, and diagnostics.</p>


      <div className="df-panel">
        <h2>Select Signal</h2>
        <select className="df-select" value={signal} onChange={(e) => setSignal(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="carry">Carry</option>
          <option value="value">Value</option>
        </select>


      <div className="df-panel">
        <h2>Decay Surface</h2>
        <pre className="df-block">
{`Lag (days)   BTC   ETH   SOL
──────────────────────────────
0             1.00  1.00  1.00
1             0.72  0.68  0.61
3             0.48  0.42  0.38
5             0.31  0.28  0.22
10            0.12  0.10  0.08`}
        </pre>


      <div className="df-panel">
        <h2>Decay Diagnostics</h2>
        <pre className="df-block">
{`Half‑Life: 2.8 days
Stability: Medium
Decay Regime: Accelerating`}
        </pre>


      <div className="df-panel">
        <h2>Decay Log</h2>
        <ul className="df-log">
          <li>Decay surface computed</li>
          <li>Half‑life estimated</li>
          <li>Diagnostics updated</li>
        </ul>



</DockablePanel>
  );
}


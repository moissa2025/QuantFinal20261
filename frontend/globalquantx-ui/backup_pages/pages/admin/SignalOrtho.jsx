import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function SignalOrtho() {
  const [signal, setSignal] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="cw-container">

      <div className="cw-header">
        <h1>Multi‑Asset Signal Orthogonalization Engine</h1>
        <p>Signal correlation, orthogonalization, and residual alpha diagnostics.</p>


      {/* SIGNAL SELECTOR */}
      <div className="cw-panel">
        <h2>Select Base Signal</h2>

        <select className="cw-select" value={signal} onChange={(e) => setSignal(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="carry">Carry</option>
          <option value="value">Value</option>
          <option value="vol">Volatility</option>
        </select>


      {/* CORRELATION */}
      <div className="cw-panel">
        <h2>Signal Correlation</h2>

        <pre className="cw-block">
{`Momentum vs Carry:      0.42
Momentum vs Value:      -0.12
Momentum vs Vol:         0.18`}
        </pre>


      {/* ORTHOGONALIZED SIGNAL */}
      <div className="cw-panel">
        <h2>Orthogonalized Signal</h2>

        <pre className="cw-block">
{`Residual Alpha:         +0.8%
Orthogonality:           High
Stability:               Moderate`}
        </pre>


      {/* HEATMAP */}
      <div className="cw-panel">
        <h2>Orthogonality Heatmap</h2>

        <pre className="cw-block">
{`Correlation Stress:     ███████████
Residual Alpha:          ████████████████
Signal Stability:        █████████`}
        </pre>


      {/* LOG */}
      <div className="cw-panel">
        <h2>Ortho Log</h2>

        <ul className="cw-log">
          <li>Correlation matrix computed</li>
          <li>Signal orthogonalized</li>
          <li>Residual alpha estimated</li>
        </ul>



</DockablePanel>
  );
}


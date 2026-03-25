import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function StrategySuperLab() {
  const [strategy, setStrategy] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="ssl-container">

      <div className="ssl-header">
        <h1>Strategy Super‑Lab</h1>
        <p>Alpha, stress, drift, and ensemble diagnostics for a single strategy.</p>


      <div className="ssl-panel">
        <h2>Select Strategy</h2>
        <select className="ssl-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="carry">Carry</option>
          <option value="value">Value</option>
          <option value="vol">Volatility</option>
        </select>


      <div className="ssl-grid">

        <div className="ssl-column">
          <div className="ssl-panel">
            <h2>Alpha Profile</h2>
            <pre className="ssl-block">
{`Alpha (30d):      +1.8%
Alpha (90d):      +4.2%
Hit Rate:         57%`}
            </pre>


          <div className="ssl-panel">
            <h2>Alpha Decay Snapshot</h2>
            <pre className="ssl-block">
{`Lag 0d:  1.00
Lag 1d:  0.72
Lag 3d:  0.48
Lag 5d:  0.31`}
            </pre>


          <div className="ssl-panel">
            <h2>Robustness Curve</h2>
            <pre className="ssl-block">
{`Perturbation   Sharpe
──────────────────────
0%             1.42
10%            1.18
20%            0.92`}
            </pre>



        <div className="ssl-column">
          <div className="ssl-panel">
            <h2>Stress & Drift</h2>
            <pre className="ssl-block">
{`Stress Level:       Moderate
Parameter Drift:     18%
Signal Drift:        12%`}
            </pre>


          <div className="ssl-panel">
            <h2>Lifecycle Stage</h2>
            <pre className="ssl-block">
{`Stage:              Test
Sharpe:              1.42
Drawdown:            -8.4%
Deployment Readiness: High`}
            </pre>


          <div className="ssl-panel">
            <h2>Risk Snapshot</h2>
            <pre className="ssl-block">
{`Capacity:           $140M
Turnover:            Medium
Vol Target:          10%`}
            </pre>



        <div className="ssl-column">
          <div className="ssl-panel">
            <h2>Ensemble & Meta‑Signal</h2>
            <pre className="ssl-block">
{`Ensemble Method:    Stacking
Meta‑Signal Strength: 74%
Model Agreement:      High`}
            </pre>


          <div className="ssl-panel">
            <h2>Orthogonalization Snapshot</h2>
            <pre className="ssl-block">
{`Residual Alpha:      +0.8%
Orthogonality:        High
Stability:            Moderate`}
            </pre>


          <div className="ssl-panel">
            <h2>Strategy Log</h2>
            <ul className="ssl-log">
              <li>Parameters updated</li>
              <li>Stress scenario applied</li>
              <li>Meta‑signal recomputed</li>
            </ul>





</DockablePanel>
  );
}


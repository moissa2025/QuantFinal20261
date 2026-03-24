import { useState } from "react";

export default function VolSurfaceRegime() {
  const [asset, setAsset] = useState("BTC");

  return (
    <div className="vsr-container">

      <div className="vsr-header">
        <h1>Global Volatility Surface Regime Board</h1>
        <p>Skew, smile, term structure, and vol‑surface diagnostics.</p>
      </div>

      {/* ASSET SELECTOR */}
      <div className="vsr-panel">
        <h2>Select Asset</h2>

        <select className="vsr-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
        </select>
      </div>

      {/* SURFACE SNAPSHOT */}
      <div className="vsr-panel">
        <h2>Vol Surface Snapshot</h2>

        <pre className="vsr-block">
{asset === "BTC" && `25D RR:       -4.2%
25D Fly:       +1.8%
ATM IV:        70%`}

{asset === "ETH" && `25D RR:       -3.1%
25D Fly:       +1.2%
ATM IV:        64%`}

{asset === "SOL" && `25D RR:       -6.4%
25D Fly:       +2.4%
ATM IV:        82%`}
        </pre>
      </div>

      {/* REGIME */}
      <div className="vsr-panel">
        <h2>Surface Regime</h2>

        <pre className="vsr-block">
{`Regime: Skew‑Dominant
Smile Intensity: High
Term Structure: Steep`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="vsr-panel">
        <h2>Vol Surface Heatmap</h2>

        <pre className="vsr-block">
{`Skew Stress:        ████████████████
Smile Stress:        ███████████
Term Structure:      █████████████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="vsr-panel">
        <h2>Vol Surface Log</h2>

        <ul className="vsr-log">
          <li>Surface loaded</li>
          <li>Regime classified</li>
          <li>Heatmap updated</li>
        </ul>
      </div>

    </div>
  );
}


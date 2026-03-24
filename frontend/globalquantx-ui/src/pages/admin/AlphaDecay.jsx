import { useState } from "react";

export default function AlphaDecay() {
  const [signal, setSignal] = useState("momentum");

  return (
    <div className="ad-container">

      <div className="ad-header">
        <h1>Alpha Decay Analyzer</h1>
        <p>Signal half‑life, decay curves, and turnover diagnostics.</p>
      </div>

      {/* SIGNAL SELECTOR */}
      <div className="ad-panel">
        <h2>Select Signal</h2>

        <select className="ad-select" value={signal} onChange={(e) => setSignal(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="meanrev">Mean Reversion</option>
          <option value="carry">Carry</option>
          <option value="vol">Volatility</option>
        </select>
      </div>

      {/* DECAY CURVE */}
      <div className="ad-panel">
        <h2>Decay Curve</h2>

        <pre className="ad-block">
{`Lag (days)   Correlation
────────────────────────
0             1.00
1             0.72
3             0.48
5             0.31
10            0.12`}
        </pre>
      </div>

      {/* HALF-LIFE */}
      <div className="ad-panel">
        <h2>Signal Half‑Life</h2>

        <pre className="ad-block">
{`Half‑Life: 2.8 days
Turnover:   41%`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ad-panel">
        <h2>Alpha Decay Log</h2>

        <ul className="ad-log">
          <li>Decay curve computed</li>
          <li>Half‑life estimated</li>
          <li>Turnover calculated</li>
        </ul>
      </div>

    </div>
  );
}


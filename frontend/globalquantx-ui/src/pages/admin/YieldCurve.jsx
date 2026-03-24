import { useState } from "react";

export default function YieldCurve() {
  const [curve, setCurve] = useState("gov");

  return (
    <div className="yc-container">

      <div className="yc-header">
        <h1>Synthetic Yield Curve Constructor</h1>
        <p>Rates, swaps, forwards, and curve diagnostics.</p>
      </div>

      {/* CURVE SELECTOR */}
      <div className="yc-panel">
        <h2>Select Curve Type</h2>

        <select className="yc-select" value={curve} onChange={(e) => setCurve(e.target.value)}>
          <option value="gov">Government Curve</option>
          <option value="swap">Swap Curve</option>
          <option value="forward">Forward Curve</option>
        </select>
      </div>

      {/* CURVE DATA */}
      <div className="yc-panel">
        <h2>Curve Data</h2>

        <pre className="yc-block">
{curve === "gov" && `Tenor   Yield
1Y      3.2%
2Y      3.4%
5Y      3.7%
10Y     4.1%
30Y     4.4%`}

{curve === "swap" && `Tenor   Swap Rate
1Y      3.5%
2Y      3.8%
5Y      4.2%
10Y     4.5%
30Y     4.7%`}

{curve === "forward" && `Tenor   Fwd Rate
1Y→2Y   3.6%
2Y→3Y   3.9%
5Y→7Y   4.3%
10Y→15Y 4.6%`}
        </pre>
      </div>

      {/* CURVE SHIFTS */}
      <div className="yc-panel">
        <h2>Curve Shifts</h2>

        <pre className="yc-block">
{`Parallel Shift:     +12 bps
Steepener:           +8 bps (long end)
Flattener:           -6 bps (short end)`}
        </pre>
      </div>

      {/* ANOMALIES */}
      <div className="yc-panel">
        <h2>Curve Anomalies</h2>

        <ul className="yc-log">
          <li>5Y–10Y inversion detected</li>
          <li>Forward curve kink at 7Y</li>
        </ul>
      </div>

    </div>
  );
}


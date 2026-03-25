import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function TimingAlpha() {
  const [mode, setMode] = useState("arrival"    </DockablePanel>
  );

  return (
    <div className="cx-container">

      <div className="cx-header">
        <h1>Execution‑Timing Alpha Lab</h1>
        <p>Arrival, participation, and opportunistic timing diagnostics.</p>


      {/* MODE SELECTOR */}
      <div className="cx-panel">
        <h2>Select Timing Mode</h2>

        <select className="cx-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="arrival">Arrival Price</option>
          <option value="participation">Participation Rate</option>
          <option value="opportunistic">Opportunistic</option>
        </select>


      {/* ALPHA DETAILS */}
      <div className="cx-panel">
        <h2>Timing Alpha</h2>

        <pre className="cx-block">
{mode === "arrival" && `Arrival Alpha:       +$3.20
Slippage:            -$1.40
Net Alpha:           +$1.80`}

{mode === "participation" && `Participation Alpha: +$2.10
Impact:              -$0.80
Net Alpha:           +$1.30`}

{mode === "opportunistic" && `Opportunistic Alpha: +$4.80
Timing Benefit:      +$1.20
Net Alpha:           +$6.00`}
        </pre>


      {/* CURVE */}
      <div className="cx-panel">
        <h2>Timing Curve</h2>

        <pre className="cx-block">
{`Timing
────────────────────────
1s     ████
10s    ████████
60s    ███████████████
300s   ███████████████████████`}
        </pre>


      {/* LOG */}
      <div className="cx-panel">
        <h2>Timing Log</h2>

        <ul className="cx-log">
          <li>Timing mode selected</li>
          <li>Alpha computed</li>
          <li>Timing curve generated</li>
        </ul>



</DockablePanel>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ShockPropagation() {
  const [shock, setShock] = useState("rates"    </DockablePanel>
  );

  return (
    <div className="cz-container">

      <div className="cz-header">
        <h1>Multi‑Asset Shock Propagation Engine</h1>
        <p>Cross‑asset contagion, shock intensity, and propagation diagnostics.</p>


      {/* SHOCK SELECTOR */}
      <div className="cz-panel">
        <h2>Select Shock Type</h2>

        <select className="cz-select" value={shock} onChange={(e) => setShock(e.target.value)}>
          <option value="rates">Rates Shock</option>
          <option value="fx">FX Shock</option>
          <option value="credit">Credit Shock</option>
        </select>


      {/* SHOCK DETAILS */}
      <div className="cz-panel">
        <h2>Shock Details</h2>

        <pre className="cz-block">
{shock === "rates" && `US 10Y +18bps
Global Duration Hit
Risk Assets Under Pressure`}

{shock === "fx" && `USD Spike
EM FX Under Stress
Carry Unwinds`}

{shock === "credit" && `HY Spreads +42bps
IG Spreads +12bps
Credit Stress Rising`}
        </pre>


      {/* PROPAGATION */}
      <div className="cz-panel">
        <h2>Shock Propagation</h2>

        <pre className="cz-block">
{`Crypto:             ███████████
Equities:            ████████████████
Rates:               █████████████████████
Credit:              █████████████`}
        </pre>


      {/* LOG */}
      <div className="cz-panel">
        <h2>Shock Log</h2>

        <ul className="cz-log">
          <li>Shock applied</li>
          <li>Propagation computed</li>
          <li>Contagion map updated</li>
        </ul>



</DockablePanel>
  );
}


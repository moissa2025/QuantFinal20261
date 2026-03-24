import { useState } from "react";

export default function CapitalFlows() {
  const [region, setRegion] = useState("EM");

  return (
    <div className="cfw-container">

      <div className="cfw-header">
        <h1>Global Capital Flows Monitor</h1>
        <p>EM, DM, FX flows, and cross‑border pressure.</p>
      </div>

      {/* REGION SELECTOR */}
      <div className="cfw-panel">
        <h2>Select Region</h2>

        <select className="cfw-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="EM">Emerging Markets</option>
          <option value="DM">Developed Markets</option>
          <option value="FX">FX Flows</option>
        </select>
      </div>

      {/* FLOW DATA */}
      <div className="cfw-panel">
        <h2>Flow Data</h2>

        <pre className="cfw-block">
{region === "EM" && `Brazil       +$420M
India        +$310M
South Africa  -$80M`}

{region === "DM" && `US Equities   +$1.2B
EU Bonds      -$240M
Japan Equity  +$180M`}

{region === "FX" && `USD Inflows    +$620M
EUR Outflows  -$310M
JPY Inflows   +$140M`}
        </pre>
      </div>

      {/* HEATMAP */}
      <div className="cfw-panel">
        <h2>Flow Heatmap</h2>

        <pre className="cfw-block">
{`Inflow Momentum:     ████████████
Outflow Pressure:     ██████
FX Carry Flows:       ███████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="cfw-panel">
        <h2>Flow Event Log</h2>

        <ul className="cfw-log">
          <li>EM inflows accelerating</li>
          <li>DM bond outflows rising</li>
          <li>USD carry inflows detected</li>
        </ul>
      </div>

    </div>
  );
}


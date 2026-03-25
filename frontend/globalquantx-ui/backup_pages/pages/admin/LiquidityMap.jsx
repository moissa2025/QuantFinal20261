import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LiquidityMap() {
  const [region, setRegion] = useState("USD"    </DockablePanel>
  );

  return (
    <div className="glm-container">

      <div className="glm-header">
        <h1>Global Liquidity Map</h1>
        <p>Funding, repo, cross‑currency basis, and liquidity diagnostics.</p>


      {/* REGION SELECTOR */}
      <div className="glm-panel">
        <h2>Select Region</h2>

        <select className="glm-select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
        </select>


      {/* FUNDING DATA */}
      <div className="glm-panel">
        <h2>Funding Conditions</h2>

        <pre className="glm-block">
{region === "USD" && `SOFR:              5.32%
Repo Rate:         5.28%
Funding Stress:    Elevated`}

{region === "EUR" && `€STR:              3.62%
Repo Rate:         3.55%
Funding Stress:    Moderate`}

{region === "JPY" && `TONA:              0.08%
Repo Rate:         0.06%
Funding Stress:    Low`}
        </pre>


      {/* BASIS */}
      <div className="glm-panel">
        <h2>Cross‑Currency Basis</h2>

        <pre className="glm-block">
{`USD/JPY Basis:     -18 bps
EUR/USD Basis:      -12 bps
GBP/USD Basis:      -4 bps`}
        </pre>


      {/* HEATMAP */}
      <div className="glm-panel">
        <h2>Liquidity Heatmap</h2>

        <pre className="glm-block">
{`Funding Liquidity:     ████████████████
Market Liquidity:       ███████████
Cross‑Currency Basis:   █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="glm-panel">
        <h2>Liquidity Event Log</h2>

        <ul className="glm-log">
          <li>Repo stress elevated</li>
          <li>USD basis widening</li>
          <li>Funding liquidity tightening</li>
        </ul>



</DockablePanel>
  );
}


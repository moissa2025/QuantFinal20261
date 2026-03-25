import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MarketIntelligence() {
  const [view, setView] = useState("macro"    </DockablePanel>
  );

  return (
    <div className="cy-container">

      <div className="cy-header">
        <h1>Global Market Intelligence Hub</h1>
        <p>Cross‑asset insights, macro signals, and intelligence diagnostics.</p>


      {/* VIEW SELECTOR */}
      <div className="cy-panel">
        <h2>Select Intelligence View</h2>

        <select className="cy-select" value={view} onChange={(e) => setView(e.target.value)}>
          <option value="macro">Macro</option>
          <option value="flows">Flows</option>
          <option value="micro">Microstructure</option>
        </select>


      {/* INSIGHTS */}
      <div className="cy-panel">
        <h2>Insights</h2>

        <pre className="cy-block">
{view === "macro" && `Growth Momentum:     Rising
Inflation Pressure:  Elevated
Liquidity Regime:    Tightening`}

{view === "flows" && `USD Inflows:        Strong
EM Equity Flows:     Positive
Credit Flows:        Neutral`}

{view === "micro" && `Volatility:         Elevated
Depth:              Stable
Spread:             Narrow`}
        </pre>


      {/* HEATMAP */}
      <div className="cy-panel">
        <h2>Intelligence Heatmap</h2>

        <pre className="cy-block">
{`Macro Stress:        ███████████
Flow Pressure:        ████████████████
Microstructure:       ███████`}
        </pre>


      {/* LOG */}
      <div className="cy-panel">
        <h2>Intelligence Log</h2>

        <ul className="cy-log">
          <li>Macro signals updated</li>
          <li>Flow pressure detected</li>
          <li>Microstructure insights loaded</li>
        </ul>



</DockablePanel>
  );
}


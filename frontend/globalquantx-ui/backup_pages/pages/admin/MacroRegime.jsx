import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MacroRegime() {
  const [regime, setRegime] = useState("growth"    </DockablePanel>
  );

  return (
    <div className="mr3-container">

      <div className="mr3-header">
        <h1>Global Macro Regime Engine</h1>
        <p>Growth, inflation, liquidity, and macro regime diagnostics.</p>


      {/* REGIME SELECTOR */}
      <div className="mr3-panel">
        <h2>Select Regime</h2>

        <select className="mr3-select" value={regime} onChange={(e) => setRegime(e.target.value)}>
          <option value="growth">Growth Rising</option>
          <option value="inflation">Inflation Rising</option>
          <option value="liquidity">Liquidity Tightening</option>
        </select>


      {/* REGIME DETAILS */}
      <div className="mr3-panel">
        <h2>Regime Details</h2>

        <pre className="mr3-block">
{regime === "growth" && `GDP Momentum:       Strong
PMIs:               Expanding
Risk Appetite:      High
Macro Regime:       Growth Rising`}

{regime === "inflation" && `CPI Momentum:       Elevated
Wage Growth:        Strong
Inflation Regime:   Rising`}

{regime === "liquidity" && `Liquidity Index:    Tightening
Credit Spreads:     Widening
Liquidity Regime:   Contraction`}
        </pre>


      {/* HEATMAP */}
      <div className="mr3-panel">
        <h2>Macro Heatmap</h2>

        <pre className="mr3-block">
{`Growth:        ███████████
Inflation:      ████████████████
Liquidity:       █████████████████████`}
        </pre>


      {/* LOG */}
      <div className="mr3-panel">
        <h2>Macro Regime Log</h2>

        <ul className="mr3-log">
          <li>Growth momentum updated</li>
          <li>Inflation trend detected</li>
          <li>Liquidity tightening signal triggered</li>
        </ul>



</DockablePanel>
  );
}


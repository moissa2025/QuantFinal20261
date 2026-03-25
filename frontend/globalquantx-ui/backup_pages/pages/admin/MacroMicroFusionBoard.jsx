import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MacroMicroFusionBoard() {
  const [layer, setLayer] = useState("macro"    </DockablePanel>
  );

  return (
    <div className="mmf-container">

      <div className="mmf-header">
        <h1>Macro‑Micro Fusion Board</h1>
        <p>Macro → micro → vol → liquidity → fusion in one view.</p>


      <div className="mmf-panel">
        <h2>Select Layer</h2>
        <select className="mmf-select" value={layer} onChange={(e) => setLayer(e.target.value)}>
          <option value="macro">Macro</option>
          <option value="micro">Microstructure</option>
          <option value="vol">Volatility</option>
          <option value="liquidity">Liquidity</option>
          <option value="fusion">Fusion</option>
        </select>


      <div className="mmf-grid">

        <div className="mmf-column">
          <div className="mmf-panel">
            <h2>Regime Atlas</h2>
            <pre className="mmf-block">
{layer === "macro" && `Growth: Rising
Inflation: Elevated
Liquidity: Tightening
Macro Regime: Fragile Expansion`}

{layer === "micro" && `Volatility: Elevated
Depth: Stable
Spread: Narrow
Micro Regime: Expansion`}

{layer === "vol" && `Skew: Bearish
Smile: High
Term Structure: Steep
Vol Regime: Stress`}

{layer === "liquidity" && `Funding Stress: Moderate
Repo: Stable
Basis: Widening
Liquidity Regime: Tightening`}

{layer === "fusion" && `Macro + Micro + Vol + Liquidity
Fusion State: High Tension`}
            </pre>



        <div className="mmf-column">
          <div className="mmf-panel">
            <h2>Shock & Propagation</h2>
            <pre className="mmf-block">
{`Active Shock: Rates
US 10Y: +18bps
Crypto:      ███████████
Equities:    ████████████████
Rates:       █████████████████████`}
            </pre>


          <div className="mmf-panel">
            <h2>Liquidity Shockboard</h2>
            <pre className="mmf-block">
{`Depth -50%
Spread × 4
Impact +120%`}
            </pre>



        <div className="mmf-column">
          <div className="mmf-panel">
            <h2>Fusion Engine</h2>
            <pre className="mmf-block">
{`Macro Fusion:      68%
Micro Fusion:      74%
Execution Fusion:  82%`}
            </pre>


          <div className="mmf-panel">
            <h2>Fusion Heatmap</h2>
            <pre className="mmf-block">
{`Macro:        ███████████
Micro:        ████████████████
Vol:          █████████████████████
Liquidity:    ███████████`}
            </pre>





      <div className="mmf-panel mmf-log-panel">
        <h2>Fusion Log</h2>
        <ul className="mmf-log">
          <li>Rates shock applied</li>
          <li>Macro regime shifted</li>
          <li>Vol regime entered stress</li>
          <li>Liquidity tightening detected</li>
          <li>Fusion tension elevated</li>
        </ul>



</DockablePanel>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function RegimeAtlas() {
  const [layer, setLayer] = useState("macro"    </DockablePanel>
  );

  return (
    <div className="de-container">

      <div className="de-header">
        <h1>Global Market Regime Atlas</h1>
        <p>Macro → micro → vol → liquidity regime diagnostics.</p>


      <div className="de-panel">
        <h2>Select Layer</h2>
        <select className="de-select" value={layer} onChange={(e) => setLayer(e.target.value)}>
          <option value="macro">Macro</option>
          <option value="micro">Microstructure</option>
          <option value="vol">Volatility</option>
          <option value="liquidity">Liquidity</option>
        </select>


      <div className="de-panel">
        <h2>Regime Details</h2>
        <pre className="de-block">
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
        </pre>


      <div className="de-panel">
        <h2>Regime Heatmap</h2>
        <pre className="de-block">
{`Macro:          ███████████
Micro:          ████████████████
Vol:            █████████████████████
Liquidity:      ███████████`}
        </pre>


      <div className="de-panel">
        <h2>Regime Log</h2>
        <ul className="de-log">
          <li>Layer updated</li>
          <li>Regime computed</li>
          <li>Heatmap refreshed</li>
        </ul>



</DockablePanel>
  );
}


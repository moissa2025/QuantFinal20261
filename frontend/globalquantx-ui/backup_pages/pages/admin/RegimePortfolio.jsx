import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function RegimePortfolio() {
  const [regime, setRegime] = useState("riskon"    </DockablePanel>
  );

  return (
    <div className="rp-container">

      <div className="rp-header">
        <h1>Regime‑Adaptive Portfolio Engine</h1>
        <p>Adaptive weights, regime detection, and regime‑specific PnL.</p>


      {/* REGIME SELECTOR */}
      <div className="rp-panel">
        <h2>Select Regime</h2>

        <select className="rp-select" value={regime} onChange={(e) => setRegime(e.target.value)}>
          <option value="riskon">Risk‑On</option>
          <option value="riskoff">Risk‑Off</option>
          <option value="chop">Choppy</option>
        </select>


      {/* WEIGHTS */}
      <div className="rp-panel">
        <h2>Regime‑Specific Weights</h2>

        <pre className="rp-weights">
{regime === "riskon" && `BTC  50%
ETH  30%
SOL  15%
AVAX 5%`}

{regime === "riskoff" && `BTC  20%
ETH  20%
SOL  10%
AVAX 50% (stable)`}

{regime === "chop" && `BTC  30%
ETH  30%
SOL  20%
AVAX 20%`}
        </pre>


      {/* PNL */}
      <div className="rp-panel">
        <h2>Regime PnL Curve</h2>

        <pre className="rp-pnl">
{`PnL
────────────────────────
Risk‑On   ████████████████████
Risk‑Off  ████████
Choppy    ███████████`}
        </pre>


      {/* TRANSITIONS */}
      <div className="rp-panel">
        <h2>Regime Transitions</h2>

        <pre className="rp-transitions">
{`Past 30 Days
────────────────────────
Risk‑On     ███████████
Risk‑Off                ████
Choppy                  ██`}
        </pre>


      {/* LOG */}
      <div className="rp-panel">
        <h2>Regime Event Log</h2>

        <ul className="rp-log">
          <li>Regime detected</li>
          <li>Weights updated</li>
          <li>PnL recomputed</li>
        </ul>



</DockablePanel>
  );
}


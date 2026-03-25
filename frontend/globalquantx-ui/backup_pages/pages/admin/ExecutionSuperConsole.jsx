import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionSuperConsole() {
  const [mode, setMode] = useState("vwap"    </DockablePanel>
  );

  return (
    <div className="esc-container">

      <div className="esc-header">
        <h1>Execution Super‑Console</h1>
        <p>Microstructure, risk, and timing alpha in one execution brain.</p>


      <div className="esc-panel">
        <h2>Select Execution Mode</h2>
        <select className="esc-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="vwap">VWAP</option>
          <option value="pov">Participation (POV)</option>
          <option value="opportunistic">Opportunistic</option>
        </select>


      <div className="esc-grid">

        <div className="esc-column">
          <div className="esc-panel">
            <h2>Microstructure Snapshot</h2>
            <pre className="esc-block">
{`Volatility: Elevated
Depth:      Stable
Spread:     Narrow
Micro Regime: Expansion`}
            </pre>


          <div className="esc-panel">
            <h2>Micro‑Replay Snippet</h2>
            <pre className="esc-block">
{`21:10:44.120  Bid +2bps
21:10:44.128  Ask -1bps
21:10:44.131  Micro‑fill 0.04 BTC`}
            </pre>



        <div className="esc-column">
          <div className="esc-panel">
            <h2>Execution‑Risk Scenario</h2>
            <pre className="esc-block">
{`Venue A: Depth -60%
Venue B: Spread × 3
Routing Stress: Medium`}
            </pre>


          <div className="esc-panel">
            <h2>Venue & Routing Stress</h2>
            <pre className="esc-block">
{`Venue Stress:   High
Routing Stress:  Medium
Impact Stress:   Elevated`}
            </pre>



        <div className="esc-column">
          <div className="esc-panel">
            <h2>Timing Alpha</h2>
            <pre className="esc-block">
{mode === "vwap" && `Arrival Alpha:   +$2.40
Slippage:        -$1.10
Net Alpha:       +$1.30`}

{mode === "pov" && `Participation Alpha: +$2.10
Impact:              -$0.80
Net Alpha:           +$1.30`}

{mode === "opportunistic" && `Opportunistic Alpha: +$4.80
Timing Benefit:      +$1.20
Net Alpha:           +$6.00`}
            </pre>


          <div className="esc-panel">
            <h2>Execution Log</h2>
            <ul className="esc-log">
              <li>Execution mode selected</li>
              <li>Scenario stress applied</li>
              <li>Timing alpha recomputed</li>
            </ul>





</DockablePanel>
  );
}


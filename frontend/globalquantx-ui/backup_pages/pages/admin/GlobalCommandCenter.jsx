import DockablePanel from "../../layout/DockablePanel.jsx";
import React from "react";

export default function GlobalCommandCenter() {
  return (
    <div className="gcc-container">

      {/* TOP STRIP */}
      <div className="gcc-top-strip">
        <div className="gcc-badge">
          <h1>Global Command Center</h1>
          <p>Unified view of macro, strategies, execution, and risk.</p>

        <div className="gcc-top-metrics">
          <div className="gcc-chip">
            <span className="gcc-chip-label">Macro Regime</span>
            <span className="gcc-chip-value">Fragile Expansion</span>

          <div className="gcc-chip">
            <span className="gcc-chip-label">Micro Regime</span>
            <span className="gcc-chip-value">Expansion</span>

          <div className="gcc-chip">
            <span className="gcc-chip-label">Vol Regime</span>
            <span className="gcc-chip-value">Stress</span>

          <div className="gcc-chip">
            <span className="gcc-chip-label">Liquidity</span>
            <span className="gcc-chip-value">Tightening</span>

          <div className="gcc-chip">
            <span className="gcc-chip-label">System Health</span>
            <span className="gcc-chip-value gcc-ok">Stable</span>




      {/* MAIN GRID */}
      <div className="gcc-grid">

        {/* LEFT: MACRO / SHOCK / LIQUIDITY */}
        <div className="gcc-column">
          <div className="gcc-panel">
            <h2>Macro Snapshot</h2>
            <pre className="gcc-block">
{`Growth: Rising
Inflation: Elevated
Liquidity: Tightening
Macro Regime: Fragile Expansion`}
            </pre>


          <div className="gcc-panel">
            <h2>Shock & Propagation</h2>
            <pre className="gcc-block">
{`Active Shock: Rates
US 10Y: +18bps
Risk Assets: Under Pressure`}
            </pre>


          <div className="gcc-panel">
            <h2>Liquidity & Fractures</h2>
            <pre className="gcc-block">
{`Liquidity Regime: Tightening
Fragmentation: 62%
Fracture Risk: High`}
            </pre>



        {/* CENTER: STRATEGIES */}
        <div className="gcc-column">
          <div className="gcc-panel">
            <h2>Strategy P&L / Alpha</h2>
            <pre className="gcc-block">
{`Momentum:     +1.8%
Carry:        +0.9%
Value:        +0.4%
Vol:          +1.2%`}
            </pre>


          <div className="gcc-panel">
            <h2>Strategy Stress & Drift</h2>
            <pre className="gcc-block">
{`Stress Level:   Moderate
Parameter Drift: 18%
Signal Drift:    12%`}
            </pre>


          <div className="gcc-panel">
            <h2>Ensemble & Meta‑Signal</h2>
            <pre className="gcc-block">
{`Meta‑Signal Strength: 74%
Model Agreement:       High
Ensemble Stability:    Moderate`}
            </pre>



        {/* RIGHT: EXECUTION */}
        <div className="gcc-column">
          <div className="gcc-panel">
            <h2>Execution Quality</h2>
            <pre className="gcc-block">
{`Arrival Alpha:     +$3.20
Slippage:           -$1.40
Net Alpha:          +$1.80`}
            </pre>


          <div className="gcc-panel">
            <h2>Venue & Routing Stress</h2>
            <pre className="gcc-block">
{`Venue Stress:      High
Routing Stress:     Medium
Impact Stress:      Elevated`}
            </pre>


          <div className="gcc-panel">
            <h2>Microstructure Snapshot</h2>
            <pre className="gcc-block">
{`Volatility: Elevated
Depth:      Stable
Spread:     Narrow`}
            </pre>




      {/* GLOBAL LOG */}
      <div className="gcc-panel gcc-log-panel">
        <h2>Global Event Log</h2>
        <ul className="gcc-log">
          <li>Rates shock applied</li>
          <li>Macro regime shifted to Fragile Expansion</li>
          <li>Liquidity fracture flagged in BTCUSD</li>
          <li>Momentum strategy stress elevated</li>
          <li>Venue A depth collapse simulated</li>
        </ul>



</DockablePanel>
  );
}


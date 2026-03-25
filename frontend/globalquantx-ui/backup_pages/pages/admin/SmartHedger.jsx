import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function SmartHedger() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="sh-container">

      <div className="sh-header">
        <h1>Multi‑Venue Smart Hedger</h1>
        <p>Delta, gamma, and cross‑venue hedge optimization.</p>


      {/* EXPOSURE */}
      <div className="sh-panel">
        <h2>Current Exposure</h2>

        <pre className="sh-block">
{`Delta:   +42.1 BTC
Gamma:   -0.84
Vega:    +12.4`}
        </pre>


      {/* VENUE PRICES */}
      <div className="sh-panel">
        <h2>Venue Prices</h2>

        <pre className="sh-block">
{`Venue A   68210
Venue B   68214
Venue C   68208`}
        </pre>


      {/* HEDGE ROUTING */}
      <div className="sh-panel">
        <h2>Optimal Hedge Routing</h2>

        <pre className="sh-block">
{`Hedge Size: 42.1 BTC

Routing:
  20.0 → Venue C
  12.1 → Venue A
  10.0 → Venue B

Expected Slippage: 0.004%`}
        </pre>


      {/* COST */}
      <div className="sh-panel">
        <h2>Hedge Cost</h2>

        <pre className="sh-block">
{`Actual Cost:        -$14,820
Optimal Cost:        -$12,440

Improvement:         +$2,380`}
        </pre>


      {/* LOG */}
      <div className="sh-panel">
        <h2>Hedger Log</h2>

        <ul className="sh-log">
          <li>Exposure loaded</li>
          <li>Cross‑venue quotes analyzed</li>
          <li>Optimal hedge computed</li>
        </ul>



</DockablePanel>
  );
}


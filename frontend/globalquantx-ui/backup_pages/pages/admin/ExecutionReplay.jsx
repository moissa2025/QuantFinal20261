import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionReplay() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="er-container">

      <div className="er-header">
        <h1>Execution Replay with Counterfactual Routing</h1>
        <p>Replay executions and simulate alternative routing paths.</p>


      {/* CONTROLS */}
      <div className="er-panel">
        <h2>Replay Controls</h2>

        <div className="er-row">
          <div className="er-item">
            <label>Market</label>
            <select className="er-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              <option>BTCUSD</option>
              <option>ETHUSD</option>
              <option>SOLUSD</option>
            </select>


          <div className="er-item">
            <label>Execution ID</label>
            <input type="text" placeholder="e.g. EX12345" />



        <button className="er-btn">Replay Execution</button>


      {/* ACTUAL EXECUTION */}
      <div className="er-panel">
        <h2>Actual Execution</h2>

        <pre className="er-block">
{`Venue: A
Fill: 0.8 BTC
Avg Price: 68214
Slippage: 0.006%`}
        </pre>


      {/* COUNTERFACTUAL */}
      <div className="er-panel">
        <h2>Counterfactual Routing</h2>

        <pre className="er-block">
{`Routing:
  0.5 → Venue A
  0.3 → Venue B

Expected Fill: 0.92 BTC
Expected Slippage: 0.004%`}
        </pre>


      {/* COMPARISON */}
      <div className="er-panel">
        <h2>Outcome Comparison</h2>

        <pre className="er-block">
{`Actual:        -$14.20
Counterfactual: -$9.80

Improvement:    +$4.40`}
        </pre>


      {/* LOG */}
      <div className="er-panel">
        <h2>Replay Log</h2>

        <ul className="er-log">
          <li>Execution loaded</li>
          <li>Counterfactual routing applied</li>
          <li>Outcome computed</li>
        </ul>



</DockablePanel>
  );
}


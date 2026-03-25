import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function SmartRouter() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );
  const [size, setSize] = useState("1.0"    </DockablePanel>
  );

  return (
    <div className="sr-container">

      <div className="sr-header">
        <h1>Smart Order Router Simulator</h1>
        <p>Simulate routing paths, venue selection, and execution outcomes.</p>


      {/* INPUTS */}
      <div className="sr-panel">
        <h2>Order Parameters</h2>

        <div className="sr-row">
          <div className="sr-item">
            <label>Market</label>
            <select className="sr-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              <option>BTCUSD</option>
              <option>ETHUSD</option>
              <option>SOLUSD</option>
            </select>


          <div className="sr-item">
            <label>Order Size</label>
            <input type="text" value={size} onChange={(e) => setSize(e.target.value)} />



        <button className="sr-btn">Simulate Routing</button>


      {/* VENUE SCORES */}
      <div className="sr-panel">
        <h2>Venue Scores</h2>

        <table className="sr-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Liquidity</th>
              <th>Latency</th>
              <th>Slippage</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            <tr><td>Venue A</td><td>High</td><td>12ms</td><td>0.003%</td><td className="positive">A</td></tr>
            <tr><td>Venue B</td><td>Medium</td><td>18ms</td><td>0.006%</td><td className="warning">B+</td></tr>
            <tr><td>Venue C</td><td>Low</td><td>25ms</td><td>0.012%</td><td className="negative">C</td></tr>
          </tbody>
        </table>


      {/* ROUTING PATH */}
      <div className="sr-panel">
        <h2>Routing Path</h2>

        <pre className="sr-path">
{`Order Size: ${size} ${symbol}

Routing:
  0.6 → Venue A
  0.3 → Venue B
  0.1 → Venue C

Expected Fill: 93%
Expected Slippage: 0.005%`}
        </pre>


      {/* EVENT LOG */}
      <div className="sr-panel">
        <h2>Routing Event Log</h2>

        <ul className="sr-log">
          <li><strong>21:10:44</strong> — Venue A selected as primary</li>
          <li><strong>21:10:45</strong> — Venue B added for residual</li>
          <li><strong>21:10:46</strong> — Venue C fallback engaged</li>
        </ul>



</DockablePanel>
  );
}


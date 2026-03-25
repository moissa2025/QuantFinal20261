import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function ExecutionQuality() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="eq-container">

      {/* HEADER */}
      <div className="eq-header">
        <h1>Execution Quality Dashboard</h1>
        <p>TCA, routing performance, slippage, and market impact analytics.</p>


      {/* SYMBOL SELECTOR */}
      <div className="eq-panel">
        <h2>Select Market</h2>

        <select
          className="eq-select"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
          <option>AVAXUSD</option>
        </select>


      {/* TOP‑LEVEL EXECUTION METRICS */}
      <div className="eq-panel">
        <h2>Execution Summary</h2>

        <div className="eq-row">
          <div className="eq-card">
            <h3>Avg Slippage</h3>
            <div className="metric">0.004%</div>


          <div className="eq-card">
            <h3>Fill Ratio</h3>
            <div className="metric positive">92%</div>


          <div className="eq-card">
            <h3>Implementation Shortfall</h3>
            <div className="metric">$14.20</div>


          <div className="eq-card">
            <h3>Market Impact</h3>
            <div className="metric warning">Medium</div>




      {/* SLIPPAGE DISTRIBUTION */}
      <div className="eq-panel">
        <h2>Slippage Distribution</h2>

        <pre className="eq-histogram">
{`Slippage (bps)
────────────────────────
-4     ████
-2     █████████
 0     ████████████████████
+2     ███████
+4     ██`}
        </pre>


      {/* ROUTING PERFORMANCE */}
      <div className="eq-panel">
        <h2>Venue Routing Performance</h2>

        <table className="eq-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Fill Ratio</th>
              <th>Avg Slippage</th>
              <th>Impact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Venue A</td>
              <td className="positive">94%</td>
              <td>0.003%</td>
              <td className="positive">Low</td>
              <td><button className="eq-btn small">Details</button></td>
            </tr>

            <tr>
              <td>Venue B</td>
              <td className="warning">81%</td>
              <td>0.009%</td>
              <td className="warning">Medium</td>
              <td><button className="eq-btn small">Details</button></td>
            </tr>

            <tr>
              <td>Venue C</td>
              <td className="negative">68%</td>
              <td>0.014%</td>
              <td className="negative">High</td>
              <td><button className="eq-btn small">Details</button></td>
            </tr>
          </tbody>
        </table>


      {/* ARRIVAL PRICE VS EXECUTION PRICE */}
      <div className="eq-panel">
        <h2>Arrival vs Execution Price</h2>

        <pre className="eq-chart">
{`Price (USD)
────────────────────────
Arrival     68205
Exec Avg    68214
Impact      +9`}
        </pre>


      {/* MARKET IMPACT CURVE */}
      <div className="eq-panel">
        <h2>Market Impact Curve</h2>

        <pre className="eq-chart">
{`Order Size (BTC)   Impact ($)
──────────────────────────────
0.1                 1.20
0.5                 4.80
1.0                 14.20
2.0                 38.50
5.0                 120.00`}
        </pre>


      {/* EXECUTION EVENTS */}
      <div className="eq-panel">
        <h2>Execution Event Log</h2>

        <ul className="eq-log">
          <li><strong>2026‑03‑23 21:10</strong> — Slippage spike detected</li>
          <li><strong>2026‑03‑23 20:44</strong> — Venue C underperformed</li>
          <li><strong>2026‑03‑23 19:12</strong> — Large order caused impact jump</li>
        </ul>



</DockablePanel>
  );
}


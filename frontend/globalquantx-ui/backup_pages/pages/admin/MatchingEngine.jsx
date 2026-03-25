import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MatchingEngine() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );

  return (
    <div className="me-container">

      {/* HEADER */}
      <div className="me-header">
        <h1>Matching Engine Inspector</h1>
        <p>Order book, queues, depth, and match events.</p>


      {/* SYMBOL SELECTOR */}
      <div className="me-panel">
        <h2>Select Market</h2>

        <select
          className="me-select"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
          <option>AVAXUSD</option>
        </select>


      {/* ORDER BOOK */}
      <div className="me-panel">
        <h2>Order Book (Top 10 Levels)</h2>

        <table className="me-table">
          <thead>
            <tr>
              <th>Bid Size</th>
              <th>Bid Price</th>
              <th>Ask Price</th>
              <th>Ask Size</th>
            </tr>
          </thead>

          <tbody>
            <tr><td>1.20</td><td>$68,200</td><td>$68,210</td><td>0.90</td></tr>
            <tr><td>0.80</td><td>$68,180</td><td>$68,230</td><td>1.40</td></tr>
            <tr><td>2.10</td><td>$68,150</td><td>$68,250</td><td>0.70</td></tr>
            <tr><td>3.40</td><td>$68,120</td><td>$68,270</td><td>2.10</td></tr>
            <tr><td>1.00</td><td>$68,100</td><td>$68,300</td><td>1.80</td></tr>
          </tbody>
        </table>


      {/* FIFO QUEUES */}
      <div className="me-panel">
        <h2>FIFO Queues</h2>

        <div className="me-row">
          <div className="me-queue">
            <h3>Bid Queue</h3>
            <pre className="me-queue-box">
{`[1] id=88421 size=0.5 @ 68200
[2] id=88422 size=0.3 @ 68200
[3] id=88423 size=0.4 @ 68180`}
            </pre>


          <div className="me-queue">
            <h3>Ask Queue</h3>
            <pre className="me-queue-box">
{`[1] id=99211 size=0.2 @ 68210
[2] id=99212 size=0.7 @ 68210
[3] id=99213 size=0.5 @ 68230`}
            </pre>




      {/* MATCH EVENTS */}
      <div className="me-panel">
        <h2>Recent Match Events</h2>

        <pre className="me-events">
{`[21:10:44] MATCH  buy id=88421 vs sell id=99211  size=0.2 @ 68210
[21:10:45] MATCH  buy id=88421 vs sell id=99212  size=0.3 @ 68210
[21:10:46] MATCH  buy id=88422 vs sell id=99212  size=0.4 @ 68210`}
        </pre>


      {/* PIPELINE LATENCY */}
      <div className="me-panel">
        <h2>Matching Pipeline Latency</h2>

        <pre className="me-latency">
{`Order Ingress        4ms  ─────■
Risk Check            6ms  ─────────■
Queue Insert          2ms  ───■
Match Loop            8ms  ─────────────■
Persistence           3ms  ────■

Total: 23ms`}
        </pre>


      {/* ENGINE HEALTH */}
      <div className="me-panel">
        <h2>Engine Health</h2>

        <ul className="me-health">
          <li>Match Loop — <span className="positive">Healthy</span></li>
          <li>Queue Depth — <span className="warning">High</span></li>
          <li>Persistence — <span className="positive">Healthy</span></li>
          <li>Risk Checks — <span className="positive">Healthy</span></li>
        </ul>



</DockablePanel>
  );
}


import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MarketReplay() {
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );
  const [timestamp, setTimestamp] = useState("2026-03-23T21:10:00"    </DockablePanel>
  );

  return (
    <div className="mr-container">

      {/* HEADER */}
      <div className="mr-header">
        <h1>Market Replay & Time‑Travel Debugger</h1>
        <p>Replay historical markets, inspect order books, and debug events.</p>


      {/* CONTROLS */}
      <div className="mr-panel">
        <h2>Replay Controls</h2>

        <div className="mr-row">
          <div className="mr-item">
            <label>Market</label>
            <select
              className="mr-select"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              <option>BTCUSD</option>
              <option>ETHUSD</option>
              <option>SOLUSD</option>
              <option>AVAXUSD</option>
            </select>


          <div className="mr-item">
            <label>Timestamp</label>
            <input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />



        <div className="mr-row">
          <button className="mr-btn">⏮ Back 1m</button>
          <button className="mr-btn">▶ Play</button>
          <button className="mr-btn">⏸ Pause</button>
          <button className="mr-btn">⏭ Forward 1m</button>



      {/* ORDER BOOK */}
      <div className="mr-panel">
        <h2>Order Book @ {timestamp}</h2>

        <table className="mr-table">
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
          </tbody>
        </table>


      {/* TRADE TAPE */}
      <div className="mr-panel">
        <h2>Trade Tape</h2>

        <pre className="mr-tape">
{`[21:10:44] BUY  0.2 BTC @ 68210
[21:10:45] BUY  0.3 BTC @ 68210
[21:10:46] SELL 0.4 BTC @ 68210`}
        </pre>


      {/* EVENT STREAM */}
      <div className="mr-panel">
        <h2>Event Stream</h2>

        <pre className="mr-events">
{`[21:10:44] ORDER_ACCEPT id=88421
[21:10:44] MATCH id=88421 vs 99211
[21:10:45] ORDER_REPLACE id=88422
[21:10:46] MATCH id=88422 vs 99212`}
        </pre>


      {/* PIPELINE SNAPSHOT */}
      <div className="mr-panel">
        <h2>Pipeline Snapshot</h2>

        <pre className="mr-pipeline">
{`Ingress        OK
Risk Check     OK
Queue Insert   OK
Match Loop     OK
Persistence    OK`}
        </pre>


      {/* ANOMALY DETECTION */}
      <div className="mr-panel">
        <h2>Anomaly Detection</h2>

        <ul className="mr-anomalies">
          <li><strong>21:10:45</strong> — Latency spike detected</li>
          <li><strong>21:10:46</strong> — Order replaced unusually fast</li>
        </ul>



</DockablePanel>
  );
}


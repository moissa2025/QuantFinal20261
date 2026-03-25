import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LatencyProfiler() {
  const [service, setService] = useState("order-engine"    </DockablePanel>
  );

  return (
    <div className="lp-container">

      <div className="lp-header">
        <h1>Latency Profiler & Microburst Analyzer</h1>
        <p>Latency histograms, tail latency, and burst detection.</p>


      {/* SERVICE SELECTOR */}
      <div className="lp-panel">
        <h2>Select Service</h2>

        <select className="lp-select" value={service} onChange={(e) => setService(e.target.value)}>
          <option value="order-engine">Order Engine</option>
          <option value="market-data">Market Data</option>
          <option value="risk-engine">Risk Engine</option>
        </select>


      {/* HISTOGRAM */}
      <div className="lp-panel">
        <h2>Latency Histogram</h2>

        <pre className="lp-histogram">
{`Latency (ms)
────────────────────────
 2   ███████████████
 5   ████████████████████████
10   ███████████
20   ████
50   ██`}
        </pre>


      {/* TAIL LATENCY */}
      <div className="lp-panel">
        <h2>Tail Latency</h2>

        <ul className="lp-tail">
          <li>p95 — <strong>7ms</strong></li>
          <li>p99 — <strong>14ms</strong></li>
          <li>p999 — <strong>38ms</strong></li>
        </ul>


      {/* MICROBUSTS */}
      <div className="lp-panel">
        <h2>Microburst Detection</h2>

        <pre className="lp-bursts">
{`21:10:44  ██████████████████████████  1200 req/s
21:10:45  ████████████████            800 req/s
21:10:46  ████                         200 req/s`}
        </pre>


      {/* EVENT LOG */}
      <div className="lp-panel">
        <h2>Latency Event Log</h2>

        <ul className="lp-log">
          <li><strong>21:10:44</strong> — Microburst detected</li>
          <li><strong>21:10:45</strong> — p99 latency spike</li>
          <li><strong>21:10:46</strong> — Latency normalized</li>
        </ul>



</DockablePanel>
  );
}


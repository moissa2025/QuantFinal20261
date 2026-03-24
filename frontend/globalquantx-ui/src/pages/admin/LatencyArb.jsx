import { useState } from "react";

export default function LatencyArb() {
  const [latencyA, setLatencyA] = useState(12);
  const [latencyB, setLatencyB] = useState(18);

  return (
    <div className="la-container">

      <div className="la-header">
        <h1>Latency‑Arbitrage Sandbox</h1>
        <p>Simulate quote races, latency differences, and arb windows.</p>
      </div>

      {/* LATENCY INPUTS */}
      <div className="la-panel">
        <h2>Venue Latencies</h2>

        <pre className="la-block">
{`Venue A Latency: ${latencyA} ms
Venue B Latency: ${latencyB} ms

Latency Advantage: ${latencyB - latencyA} ms`}
        </pre>
      </div>

      {/* PRICES */}
      <div className="la-panel">
        <h2>Venue Prices</h2>

        <pre className="la-block">
{`Venue A: 68210
Venue B: 68218`}
        </pre>
      </div>

      {/* ARB WINDOW */}
      <div className="la-panel">
        <h2>Arbitrage Window</h2>

        <pre className="la-block">
{`Buy A @ 68210
Sell B @ 68218

Raw Spread: $8
Latency‑Adj Profit: $5`}
        </pre>
      </div>

      {/* LOG */}
      <div className="la-panel">
        <h2>Latency Arb Log</h2>

        <ul className="la-log">
          <li>Latency advantage computed</li>
          <li>Arb window detected</li>
          <li>Profit adjusted for latency</li>
        </ul>
      </div>

    </div>
  );
}


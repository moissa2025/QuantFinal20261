import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LeadLag() {
  const [pair, setPair] = useState("BTC‑ETH"    </DockablePanel>
  );

  return (
    <div className="ll-container">

      <div className="ll-header">
        <h1>Cross‑Asset Lead‑Lag Analyzer</h1>
        <p>Cross-correlation, lag curves, and predictive signals.</p>


      {/* PAIR SELECTOR */}
      <div className="ll-panel">
        <h2>Select Pair</h2>

        <select className="ll-select" value={pair} onChange={(e) => setPair(e.target.value)}>
          <option>BTC‑ETH</option>
          <option>ETH‑SOL</option>
          <option>BTC‑Gold</option>
          <option>BTC‑SP500</option>
        </select>


      {/* LAG CURVE */}
      <div className="ll-panel">
        <h2>Lag Curve</h2>

        <pre className="ll-block">
{`Lag (min)   Corr
────────────────────
-10          0.12
 -5          0.28
  0          0.42
 +5          0.31
+10          0.18`}
        </pre>


      {/* HEATMAP */}
      <div className="ll-panel">
        <h2>Lead‑Lag Heatmap</h2>

        <pre className="ll-block">
{`BTC → ETH     ████████████████
ETH → BTC     ████████`}
        </pre>


      {/* SIGNAL */}
      <div className="ll-panel">
        <h2>Predictive Signal</h2>

        <pre className="ll-block">
{`Signal: BTC leads ETH by ~5 minutes
Confidence: 71%`}
        </pre>


      {/* LOG */}
      <div className="ll-panel">
        <h2>Lead‑Lag Log</h2>

        <ul className="ll-log">
          <li>Cross-correlation computed</li>
          <li>Lag curve generated</li>
          <li>Lead-lag signal detected</li>
        </ul>



</DockablePanel>
  );
}


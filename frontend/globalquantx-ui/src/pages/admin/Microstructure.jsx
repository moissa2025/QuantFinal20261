import { useState } from "react";

export default function Microstructure() {
  const [symbol, setSymbol] = useState("BTCUSD");

  return (
    <div className="ms-container">

      <div className="ms-header">
        <h1>Market Microstructure Analyzer</h1>
        <p>Order flow imbalance, VPIN, and microstructure diagnostics.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="ms-panel">
        <h2>Select Market</h2>

        <select className="ms-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>
      </div>

      {/* ORDER FLOW IMBALANCE */}
      <div className="ms-panel">
        <h2>Order Flow Imbalance (OFI)</h2>

        <pre className="ms-ofi">
{`Time       OFI
────────────────────
21:10:44   +420
21:10:45   +180
21:10:46   -320`}
        </pre>
      </div>

      {/* VPIN */}
      <div className="ms-panel">
        <h2>VPIN (Toxicity)</h2>

        <ul className="ms-vpin">
          <li>VPIN — <strong>0.62</strong></li>
          <li>Bucket Size — <strong>50 trades</strong></li>
          <li>Regime — <span className="warning">Elevated Toxicity</span></li>
        </ul>
      </div>

      {/* MICROSTRUCTURE HEATMAP */}
      <div className="ms-panel">
        <h2>Microstructure Heatmap</h2>

        <pre className="ms-heatmap">
{`Price     Pressure
────────────────────────
68250     ███████████████
68230     ███████████
68210     ████████████████████
68200     ██████████████████████████`}
        </pre>
      </div>

      {/* EVENT LOG */}
      <div className="ms-panel">
        <h2>Microstructure Event Log</h2>

        <ul className="ms-log">
          <li><strong>21:10:44</strong> — Toxic flow detected</li>
          <li><strong>21:10:45</strong> — OFI spike</li>
          <li><strong>21:10:46</strong> — VPIN breach</li>
        </ul>
      </div>

    </div>
  );
}


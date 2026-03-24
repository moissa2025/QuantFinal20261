import { useState } from "react";

export default function Funding() {
  const [symbol, setSymbol] = useState("BTCUSD");

  return (
    <div className="fr-container">

      <div className="fr-header">
        <h1>Funding Rates & Carry Analytics</h1>
        <p>Funding curves, carry costs, and cross‑venue comparisons.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="fr-panel">
        <h2>Select Market</h2>

        <select className="fr-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>
      </div>

      {/* FUNDING SUMMARY */}
      <div className="fr-panel">
        <h2>Funding Summary</h2>

        <ul className="fr-summary">
          <li>Current Funding — <strong>0.012%</strong></li>
          <li>8h Projection — <strong>0.036%</strong></li>
          <li>Annualized — <strong>15.8%</strong></li>
        </ul>
      </div>

      {/* FUNDING CURVE */}
      <div className="fr-panel">
        <h2>Funding Curve</h2>

        <pre className="fr-curve">
{`Time        Funding
────────────────────────
00:00       0.010%
08:00       0.012%
16:00       0.014%
24:00       0.013%`}
        </pre>
      </div>

      {/* CROSS‑VENUE FUNDING */}
      <div className="fr-panel">
        <h2>Cross‑Venue Funding</h2>

        <table className="fr-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Funding</th>
              <th>Premium</th>
            </tr>
          </thead>

          <tbody>
            <tr><td>Venue A</td><td>0.012%</td><td className="positive">Low</td></tr>
            <tr><td>Venue B</td><td>0.018%</td><td className="warning">Medium</td></tr>
            <tr><td>Venue C</td><td>0.026%</td><td className="negative">High</td></tr>
          </tbody>
        </table>
      </div>

      {/* FUNDING EVENTS */}
      <div className="fr-panel">
        <h2>Funding Event Log</h2>

        <ul className="fr-log">
          <li><strong>21:10:44</strong> — Funding spike detected</li>
          <li><strong>18:44:12</strong> — Venue C premium widened</li>
          <li><strong>14:12:55</strong> — Carry cost inversion</li>
        </ul>
      </div>

    </div>
  );
}


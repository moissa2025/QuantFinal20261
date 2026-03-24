import { useState } from "react";

export default function BaselMetrics() {
  const [entity, setEntity] = useState("Prime Fund Capital");

  return (
    <div className="bm-container">

      <div className="bm-header">
        <h1>Risk‑Weighted Capital & Basel Metrics</h1>
        <p>RWA, capital ratios, liquidity ratios, and Basel III compliance.</p>
      </div>

      {/* ENTITY SELECTOR */}
      <div className="bm-panel">
        <h2>Select Entity</h2>

        <select className="bm-select" value={entity} onChange={(e) => setEntity(e.target.value)}>
          <option>Prime Fund Capital</option>
          <option>NorthBridge Investments</option>
          <option>Apex Quant Group</option>
        </select>
      </div>

      {/* RWA */}
      <div className="bm-panel">
        <h2>Risk‑Weighted Assets</h2>

        <ul className="bm-rwa">
          <li>Total RWA — <strong>$128M</strong></li>
          <li>Market Risk — <strong>$62M</strong></li>
          <li>Credit Risk — <strong>$44M</strong></li>
          <li>Operational Risk — <strong>$22M</strong></li>
        </ul>
      </div>

      {/* CAPITAL RATIOS */}
      <div className="bm-panel">
        <h2>Capital Ratios</h2>

        <ul className="bm-ratios">
          <li>CET1 — <strong>12.4%</strong></li>
          <li>Tier 1 — <strong>14.1%</strong></li>
          <li>Total Capital — <strong>16.8%</strong></li>
        </ul>
      </div>

      {/* LIQUIDITY RATIOS */}
      <div className="bm-panel">
        <h2>Liquidity Ratios</h2>

        <ul className="bm-liquidity">
          <li>LCR — <span className="positive">128%</span></li>
          <li>NSFR — <span className="positive">112%</span></li>
        </ul>
      </div>

      {/* EVENT LOG */}
      <div className="bm-panel">
        <h2>Basel Event Log</h2>

        <ul className="bm-log">
          <li><strong>21:10:44</strong> — RWA increased due to volatility</li>
          <li><strong>18:44:12</strong> — CET1 buffer updated</li>
          <li><strong>14:12:55</strong> — LCR stress test passed</li>
        </ul>
      </div>

    </div>
  );
}


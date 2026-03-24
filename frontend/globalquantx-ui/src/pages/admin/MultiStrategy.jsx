import { useState } from "react";

export default function MultiStrategy() {
  const [mix, setMix] = useState({
    statarb: 40,
    trend: 30,
    carry: 20,
    volarb: 10
  });

  return (
    <div className="msim-container">

      <div className="msim-header">
        <h1>Multi‑Strategy Simulator</h1>
        <p>Blend stat‑arb, trend, carry, and vol‑arb strategies.</p>
      </div>

      {/* ALLOCATION */}
      <div className="msim-panel">
        <h2>Strategy Allocation</h2>

        <ul className="msim-alloc">
          <li>Stat‑Arb — <strong>{mix.statarb}%</strong></li>
          <li>Trend — <strong>{mix.trend}%</strong></li>
          <li>Carry — <strong>{mix.carry}%</strong></li>
          <li>Vol‑Arb — <strong>{mix.volarb}%</strong></li>
        </ul>
      </div>

      {/* RETURNS */}
      <div className="msim-panel">
        <h2>Simulated Returns</h2>

        <pre className="msim-returns">
{`Strategy     Return
────────────────────────
Stat‑Arb     12.4%
Trend        18.2%
Carry        9.1%
Vol‑Arb      7.8%

Blended      13.6%`}
        </pre>
      </div>

      {/* CORRELATION */}
      <div className="msim-panel">
        <h2>Strategy Correlation</h2>

        <pre className="msim-corr">
{`          SA    TR    CA    VA
SA        1.00  0.22  0.11  0.05
TR        0.22  1.00  0.18  0.09
CA        0.11  0.18  1.00  0.14
VA        0.05  0.09  0.14  1.00`}
        </pre>
      </div>

      {/* PNL CURVE */}
      <div className="msim-panel">
        <h2>PnL Curve</h2>

        <pre className="msim-pnl">
{`PnL
────────────────────────
2019   ████
2020   ████████████
2021   ████████████████████
2022   ███████████
2023   █████████████████`}
        </pre>
      </div>

    </div>
  );
}


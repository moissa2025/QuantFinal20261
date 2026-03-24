import { useState } from "react";

export default function MarketMaking() {
  const [inventory, setInventory] = useState(0.5);

  return (
    <div className="mm-container">

      <div className="mm-header">
        <h1>Market‑Making Simulator</h1>
        <p>Quotes, inventory, skew, and fill probabilities.</p>
      </div>

      {/* INVENTORY */}
      <div className="mm-panel">
        <h2>Inventory</h2>

        <pre className="mm-block">
{`Current Inventory: ${inventory} BTC
Target Inventory:  0 BTC
Skew:              ${inventory > 0 ? "Sell‑side" : "Buy‑side"}`}
        </pre>
      </div>

      {/* QUOTES */}
      <div className="mm-panel">
        <h2>Quotes</h2>

        <pre className="mm-block">
{`Bid:  68200
Ask:  68212
Spread: 12
Skew‑Adjusted Ask: 68215`}
        </pre>
      </div>

      {/* FILL PROBABILITY */}
      <div className="mm-panel">
        <h2>Fill Probability</h2>

        <ul className="mm-fill">
          <li>Bid Fill Probability — <strong>42%</strong></li>
          <li>Ask Fill Probability — <strong>31%</strong></li>
        </ul>
      </div>

      {/* PNL */}
      <div className="mm-panel">
        <h2>PnL Curve</h2>

        <pre className="mm-block">
{`PnL
────────────────────────
Day 1   ████
Day 2   ████████
Day 3   ███████████████`}
        </pre>
      </div>

      {/* LOG */}
      <div className="mm-panel">
        <h2>Market‑Making Log</h2>

        <ul className="mm-log">
          <li>Inventory updated</li>
          <li>Quotes adjusted</li>
          <li>Fill probabilities computed</li>
        </ul>
      </div>

    </div>
  );
}


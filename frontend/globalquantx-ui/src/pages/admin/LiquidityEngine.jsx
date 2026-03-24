import { useState } from "react";

export default function LiquidityEngine() {
  const [symbol, setSymbol] = useState("BTCUSD");

  return (
    <div className="ple-container">

      <div className="ple-header">
        <h1>Portfolio Liquidity Engine</h1>
        <p>Amihud, Kyle’s Lambda, depth, and liquidity diagnostics.</p>
      </div>

      {/* SYMBOL SELECTOR */}
      <div className="ple-panel">
        <h2>Select Asset</h2>

        <select className="ple-select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
          <option>BTCUSD</option>
          <option>ETHUSD</option>
          <option>SOLUSD</option>
        </select>
      </div>

      {/* AMIHUD */}
      <div className="ple-panel">
        <h2>Amihud Illiquidity</h2>

        <pre className="ple-block">
{`Amihud:  0.0042
Interpretation: Moderate Illiquidity`}
        </pre>
      </div>

      {/* KYLE’S LAMBDA */}
      <div className="ple-panel">
        <h2>Kyle’s Lambda</h2>

        <pre className="ple-block">
{`Lambda:  0.82
Interpretation: High price impact`}
        </pre>
      </div>

      {/* DEPTH */}
      <div className="ple-panel">
        <h2>Market Depth</h2>

        <pre className="ple-block">
{`Bid Depth:  12.4 BTC
Ask Depth:  10.8 BTC
Imbalance:  +7%`}
        </pre>
      </div>

      {/* LOG */}
      <div className="ple-panel">
        <h2>Liquidity Event Log</h2>

        <ul className="ple-log">
          <li>Amihud spike detected</li>
          <li>Lambda elevated</li>
          <li>Depth imbalance widened</li>
        </ul>
      </div>

    </div>
  );
}


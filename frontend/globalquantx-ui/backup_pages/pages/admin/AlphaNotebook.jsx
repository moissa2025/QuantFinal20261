import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function AlphaNotebook() {
  const [signal, setSignal] = useState("momentum"    </DockablePanel>
  );

  return (
    <div className="an-container">

      <div className="an-header">
        <h1>Alpha Research Notebook</h1>
        <p>Signals, factors, backtests, and diagnostics.</p>


      {/* SIGNAL SELECTOR */}
      <div className="an-panel">
        <h2>Select Signal</h2>

        <select className="an-select" value={signal} onChange={(e) => setSignal(e.target.value)}>
          <option value="momentum">Momentum</option>
          <option value="meanreversion">Mean Reversion</option>
          <option value="carry">Carry</option>
          <option value="volatility">Volatility</option>
        </select>


      {/* SIGNAL VALUES */}
      <div className="an-panel">
        <h2>Signal Values</h2>

        <pre className="an-signal">
{signal === "momentum" && `BTC  +0.42
ETH  +0.31
SOL  +0.18
AVAX +0.12`}

{signal === "meanreversion" && `BTC  -0.22
ETH  -0.18
SOL  +0.05
AVAX +0.11`}

{signal === "carry" && `BTC  +0.12
ETH  +0.09
SOL  +0.04
AVAX +0.03`}

{signal === "volatility" && `BTC  +0.62
ETH  +0.48
SOL  +0.31
AVAX +0.22`}
        </pre>


      {/* BACKTEST */}
      <div className="an-panel">
        <h2>Backtest Results</h2>

        <pre className="an-backtest">
{`Cumulative Return
────────────────────────
2019   ████
2020   ████████████
2021   ████████████████████
2022   ███████████
2023   █████████████████`}
        </pre>


      {/* METRICS */}
      <div className="an-panel">
        <h2>Performance Metrics</h2>

        <ul className="an-metrics">
          <li>Sharpe — <strong>1.42</strong></li>
          <li>Max Drawdown — <strong>-12.8%</strong></li>
          <li>Win Rate — <strong>58%</strong></li>
        </ul>


      {/* LOG */}
      <div className="an-panel">
        <h2>Research Log</h2>

        <ul className="an-log">
          <li>Signal normalized</li>
          <li>Backtest executed</li>
          <li>Metrics computed</li>
        </ul>



</DockablePanel>
  );
}


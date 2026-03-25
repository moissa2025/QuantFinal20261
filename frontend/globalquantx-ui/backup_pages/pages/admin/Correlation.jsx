import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function Correlation() {
  const [windowSize, setWindowSize] = useState("30d"    </DockablePanel>
  );

  return (
    <div className="corr-container">

      {/* HEADER */}
      <div className="corr-header">
        <h1>Cross‑Asset Correlation Matrix & Regime Detection</h1>
        <p>Correlation structures, heatmaps, and market regime analytics.</p>


      {/* WINDOW SELECTOR */}
      <div className="corr-panel">
        <h2>Correlation Window</h2>

        <select
          className="corr-select"
          value={windowSize}
          onChange={(e) => setWindowSize(e.target.value)}
        >
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
          <option value="180d">180 Days</option>
        </select>


      {/* CORRELATION MATRIX */}
      <div className="corr-panel">
        <h2>Correlation Matrix ({windowSize})</h2>

        <pre className="corr-matrix">
{`          BTC   ETH   SOL   AVAX
BTC       1.00  0.82  0.61  0.55
ETH       0.82  1.00  0.74  0.68
SOL       0.61  0.74  1.00  0.72
AVAX      0.55  0.68  0.72  1.00`}
        </pre>


      {/* HEATMAP */}
      <div className="corr-panel">
        <h2>Correlation Heatmap</h2>

        <pre className="corr-heatmap">
{`BTC   ████████████████████
ETH   █████████████████
SOL   ████████████
AVAX  ██████████`}
        </pre>


      {/* REGIME DETECTION */}
      <div className="corr-panel">
        <h2>Market Regime Detection</h2>

        <ul className="corr-regimes">
          <li>Current Regime — <span className="positive">High‑Correlation Risk‑On</span></li>
          <li>Volatility Regime — <span className="warning">Elevated</span></li>
          <li>Liquidity Regime — <span className="positive">Healthy</span></li>
          <li>Macro Regime — <span className="warning">Uncertain</span></li>
        </ul>


      {/* REGIME TIMELINE */}
      <div className="corr-panel">
        <h2>Regime Timeline</h2>

        <pre className="corr-timeline">
{`Past 30 Days
──────────────────────────────────────────────
Risk‑On     ████████████████
Risk‑Off                     ████
Chop                         ██`}
        </pre>


      {/* FACTOR EXPOSURE */}
      <div className="corr-panel">
        <h2>Factor Exposure</h2>

        <ul className="corr-factors">
          <li>Momentum — <strong>+0.62</strong></li>
          <li>Volatility — <strong>+0.48</strong></li>
          <li>Liquidity — <strong>+0.31</strong></li>
          <li>Macro Beta — <strong>+0.72</strong></li>
        </ul>


      {/* CORRELATION EVENTS */}
      <div className="corr-panel">
        <h2>Correlation Event Log</h2>

        <ul className="corr-log">
          <li><strong>2026‑03‑23 21:10</strong> — BTC/ETH correlation spike</li>
          <li><strong>2026‑03‑23 18:44</strong> — SOL/AVAX decoupling detected</li>
          <li><strong>2026‑03‑23 14:12</strong> — Regime shift: Risk‑Off → Risk‑On</li>
        </ul>



</DockablePanel>
  );
}


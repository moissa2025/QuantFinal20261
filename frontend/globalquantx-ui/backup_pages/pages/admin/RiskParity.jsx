import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function RiskParity() {
  const [windowSize, setWindowSize] = useState("30d"    </DockablePanel>
  );

  return (
    <div className="rp2-container">

      <div className="rp2-header">
        <h1>Global Risk Parity Engine</h1>
        <p>Vol-adjusted weights, risk contributions, and parity diagnostics.</p>


      {/* WINDOW SELECTOR */}
      <div className="rp2-panel">
        <h2>Volatility Window</h2>

        <select className="rp2-select" value={windowSize} onChange={(e) => setWindowSize(e.target.value)}>
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
        </select>


      {/* WEIGHTS */}
      <div className="rp2-panel">
        <h2>Risk Parity Weights</h2>

        <pre className="rp2-block">
{`BTC     22%
ETH     28%
SOL     18%
AVAX    12%
Gold    10%
Bonds   10%`}
        </pre>


      {/* RISK CONTRIBUTIONS */}
      <div className="rp2-panel">
        <h2>Risk Contributions</h2>

        <pre className="rp2-block">
{`BTC     18%
ETH     19%
SOL     17%
AVAX    16%
Gold    15%
Bonds   15%`}
        </pre>


      {/* DIAGNOSTICS */}
      <div className="rp2-panel">
        <h2>Parity Diagnostics</h2>

        <pre className="rp2-block">
{`Vol Target:        12%
Achieved Vol:       11.4%
Tracking Error:     0.62%`}
        </pre>


      {/* LOG */}
      <div className="rp2-panel">
        <h2>Risk Parity Log</h2>

        <ul className="rp2-log">
          <li>Vol window loaded</li>
          <li>Covariance matrix computed</li>
          <li>Risk parity weights solved</li>
        </ul>



</DockablePanel>
  );
}


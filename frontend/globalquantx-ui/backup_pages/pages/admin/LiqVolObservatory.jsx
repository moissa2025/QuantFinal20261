import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function LiqVolObservatory() {
  const [asset, setAsset] = useState("BTC"    </DockablePanel>
  );

  return (
    <div className="lvo-container">

      <div className="lvo-header">
        <h1>Liquidity & Volatility Observatory</h1>
        <p>Vol surfaces, interactions, and liquidity fractures in one observatory.</p>


      <div className="lvo-panel">
        <h2>Select Asset</h2>
        <select className="lvo-select" value={asset} onChange={(e) => setAsset(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>Gold</option>
          <option>SP500</option>
        </select>


      <div className="lvo-grid">

        <div className="lvo-column">
          <div className="lvo-panel">
            <h2>Vol Surface Regime</h2>
            <pre className="lvo-block">
{`25D RR:       -4.2%
25D Fly:       +1.8%
ATM IV:        70%
Regime:        Skew‑Dominant`}
            </pre>


          <div className="lvo-panel">
            <h2>Term Structure Snapshot</h2>
            <pre className="lvo-block">
{`1M     +1.2%
3M     +2.4%
6M     +3.1%
12M    +4.0%`}
            </pre>



        <div className="lvo-column">
          <div className="lvo-panel">
            <h2>Vol Interaction</h2>
            <pre className="lvo-block">
{`BTC → ETH:      0.62
BTC → SOL:      0.48
ETH → SOL:      0.55`}
            </pre>


          <div className="lvo-panel">
            <h2>Vol Stress Heatmap</h2>
            <pre className="lvo-block">
{`Skew Stress:        ████████████████
Smile Stress:        ███████████
Term Structure:      █████████████████████`}
            </pre>



        <div className="lvo-column">
          <div className="lvo-panel">
            <h2>Liquidity Shock & Fracture</h2>
            <pre className="lvo-block">
{`Depth:            -50%
Spread:            × 4
Fragmentation:     62%
Fracture Risk:     High`}
            </pre>


          <div className="lvo-panel">
            <h2>Vol‑Liquidity Stress Index</h2>
            <pre className="lvo-block">
{`Vol Stress:        High
Liquidity Stress:   High
Combined Index:     0.81`}
            </pre>





      <div className="lvo-panel lvo-log-panel">
        <h2>Observatory Log</h2>
        <ul className="lvo-log">
          <li>Vol surface updated</li>
          <li>Vol interaction matrix recomputed</li>
          <li>Liquidity fracture flagged</li>
          <li>Vol‑liquidity stress index elevated</li>
        </ul>



</DockablePanel>
  );
}


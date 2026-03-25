import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function OptionsMM() {
  const [strike, setStrike] = useState("ATM"    </DockablePanel>
  );

  return (
    <div className="omm-container">

      <div className="omm-header">
        <h1>Options Market‑Making Engine</h1>
        <p>Skew, wings, vanna, and vol‑arb quoting.</p>


      {/* STRIKE SELECTOR */}
      <div className="omm-panel">
        <h2>Select Strike</h2>

        <select className="omm-select" value={strike} onChange={(e) => setStrike(e.target.value)}>
          <option>OTM Put</option>
          <option>ATM</option>
          <option>OTM Call</option>
        </select>


      {/* QUOTES */}
      <div className="omm-panel">
        <h2>Quotes</h2>

        <pre className="omm-block">
{strike === "ATM" && `Bid IV:  70%
Ask IV:  72%
Skew:    Neutral`}

{strike === "OTM Put" && `Bid IV:  82%
Ask IV:  85%
Skew:    Put‑Heavy`}

{strike === "OTM Call" && `Bid IV:  65%
Ask IV:  67%
Skew:    Call‑Light`}
        </pre>


      {/* GREEKS */}
      <div className="omm-panel">
        <h2>Greeks Exposure</h2>

        <pre className="omm-block">
{`Delta:   -12.4
Gamma:   +0.42
Vega:    +18.1
Vanna:   -4.2`}
        </pre>


      {/* VOL ARB */}
      <div className="omm-panel">
        <h2>Vol‑Arb Signal</h2>

        <pre className="omm-block">
{`Fair IV:     71.2%
Quoted IV:    72.0%

Edge:         +0.8% (sell vol)`}
        </pre>


      {/* LOG */}
      <div className="omm-panel">
        <h2>Market‑Making Log</h2>

        <ul className="omm-log">
          <li>Skew computed</li>
          <li>Greeks updated</li>
          <li>Vol‑arb signal generated</li>
        </ul>



</DockablePanel>
  );
}


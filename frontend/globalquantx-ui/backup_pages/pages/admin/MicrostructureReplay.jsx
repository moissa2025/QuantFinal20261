import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState } from "react";

export default function MicrostructureReplay() {
  const [eventId, setEventId] = useState(""    </DockablePanel>
  );

  return (
    <div className="mrp-container">

      <div className="mrp-header">
        <h1>Execution Microstructure Replay Lab</h1>
        <p>Order‑book micro‑events, quote changes, and micro‑impact replay.</p>


      {/* INPUT */}
      <div className="mrp-panel">
        <h2>Event ID</h2>

        <input
          className="mrp-input"
          type="text"
          placeholder="e.g. EVT12345"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />


      {/* MICRO EVENTS */}
      <div className="mrp-panel">
        <h2>Micro‑Events</h2>

        <pre className="mrp-block">
{`21:10:44.120  Bid +2bps
21:10:44.128  Ask -1bps
21:10:44.131  Micro‑fill 0.04 BTC
21:10:44.140  Spread narrows`}
        </pre>


      {/* TIMELINE */}
      <div className="mrp-panel">
        <h2>Replay Timeline</h2>

        <pre className="mrp-block">
{`Micro‑Replay
────────────────────────
Quote Update     ████
Micro‑Fill       ████████
Impact Event     ███████████████`}
        </pre>


      {/* LOG */}
      <div className="mrp-panel">
        <h2>Replay Log</h2>

        <ul className="mrp-log">
          <li>Event loaded</li>
          <li>Micro‑events parsed</li>
          <li>Replay generated</li>
        </ul>



</DockablePanel>
  );
}


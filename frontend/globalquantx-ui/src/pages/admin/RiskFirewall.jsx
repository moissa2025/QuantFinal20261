import { useState } from "react";

export default function RiskFirewall() {
  const [armed, setArmed] = useState(true);

  return (
    <div className="rf-container">

      <div className="rf-header">
        <h1>Real‑Time Risk Firewall</h1>
        <p>Kill‑switch, anomaly detection, and auto‑halt triggers.</p>
      </div>

      {/* STATUS */}
      <div className="rf-panel">
        <h2>Firewall Status</h2>

        <pre className="rf-block">
{`Kill‑Switch:   ${armed ? "ARMED" : "DISARMED"}
Anomalies:      2 detected
Auto‑Halt:      Enabled`}
        </pre>

        <button className="rf-btn danger" onClick={() => setArmed(!armed)}>
          {armed ? "Disarm Firewall" : "Arm Firewall"}
        </button>
      </div>

      {/* ANOMALIES */}
      <div className="rf-panel">
        <h2>Anomaly Detection</h2>

        <ul className="rf-anom">
          <li>Latency spike (p99 > 40ms)</li>
          <li>Order burst (1200 req/s)</li>
        </ul>
      </div>

      {/* THRESHOLDS */}
      <div className="rf-panel">
        <h2>Risk Thresholds</h2>

        <pre className="rf-block">
{`Max Order Rate:     800 req/s
Max Position Change: 5 BTC/s
Max Slippage:        0.02%`}
        </pre>
      </div>

      {/* LOG */}
      <div className="rf-panel">
        <h2>Firewall Log</h2>

        <ul className="rf-log">
          <li>Firewall armed</li>
          <li>Anomaly detected</li>
          <li>Auto‑halt triggered</li>
        </ul>
      </div>

    </div>
  );
}


// src/pages/app/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { mockFetch } from "../../services/mockFetch";
<div style={{position:"absolute",top:10,left:10,color:"lime",zIndex:9999}}>
  ✅ DASHBOARD RENDERED
</div>

export default function Dashboard() {
  const [health, setHealth] = useState([]);
  const [positions, setPositions] = useState([]);
  const [risk, setRisk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [h, p, r] = await Promise.all([
          mockFetch("/system/health"),
          mockFetch("/positions/snapshot"),
          mockFetch("/risk/exposures/summary"),
        ]);

        setHealth(h || []);
        setPositions(p || []);
        setRisk(r || []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="dashboard-root">
        <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "lime",
        zIndex: 9999,
      }}
    >
      DASHBOARD JSX ACTIVE
    </div>
     
      {/* Background layers */}
      <div className="quant-bg-gradient"></div>
      <div className="quant-bg-grid"></div>
      <div className="quant-bg-particles"></div>

      <div className="dashboard-content">

        {/* Top bar */}
        <div className="dashboard-topbar">
          <div className="dashboard-title">GlobalQuantX Multi‑Asset Desk</div>
          <div className="dashboard-user">Mo</div>
        </div>

        {/* Market ticker */}
        <div className="dashboard-ticker">
          {["BTC", "ETH", "AAPL", "MSFT", "EURUSD", "SPY", "QQQ"].map((t) => (
            <div key={t} className="ticker-item">
              <span>{t}</span>
              <span className="ticker-value">
                {(Math.random() * 1000).toFixed(2)}
              </span>
              <span
                className={
                  Math.random() > 0.5 ? "ticker-up" : "ticker-down"
                }
              >
                {Math.random() > 0.5 ? "+" : "-"}
                {(Math.random() * 2).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Grid layout */}
        <div className="dashboard-grid">

          {/* System Health */}
          <div className="dash-card">
            <h2>System Health</h2>
            {loading && <div>Loading...</div>}
            {!loading && (
              <ul className="health-list">
                {health.map((s) => (
                  <li key={s.service}>
                    <span>{s.service}</span>
                    <span className={s.status === "OK" ? "ok" : "bad"}>
                      {s.status}
                    </span>
                    <span>{s.latencyMs} ms</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Positions */}
          <div className="dash-card">
            <h2>Positions Snapshot</h2>
            {loading && <div>Loading...</div>}
            {!loading && (
              <ul className="positions-list">
                {positions.map((p) => (
                  <li key={p.id}>
                    <span>{p.symbol}</span>
                    <span>{p.quantity}</span>
                    <span>{p.pnl}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Risk */}
          <div className="dash-card">
            <h2>Risk Exposure</h2>
            {loading && <div>Loading...</div>}
            {!loading && (
              <ul className="risk-list">
                {risk.map((r) => (
                  <li key={r.id}>
                    <span>{r.book}</span>
                    <span>{r.symbol}</span>
                    <span>Δ {r.delta}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


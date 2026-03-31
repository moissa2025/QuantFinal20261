import React from "react";
import "./features.css";

export default function Features() {
  return (
    <div className="gqx-features">
      <h1>Platform Features</h1>
      <p className="gqx-features-sub">
        Built for desks that trade across stocks, ETFs, bonds, crypto, commodities, and FX.
      </p>

      <div className="gqx-features-grid">
        <div>
          <h3>Multi‑Asset Execution</h3>
          <p>Single blotter for equities, fixed income, digital assets, and macro products.</p>
        </div>
        <div>
          <h3>Risk & Hedging</h3>
          <p>Portfolio‑level risk, hedging workflows, and scenario analysis in real time.</p>
        </div>
        <div>
          <h3>Connectivity</h3>
          <p>APIs, FIX, and streaming feeds into brokers, venues, and internal systems.</p>
        </div>
        <div>
          <h3>Compliance & Audit</h3>
          <p>Full audit trails, entitlements, and controls for institutional governance.</p>
        </div>
      </div>
    </div>
  );
}


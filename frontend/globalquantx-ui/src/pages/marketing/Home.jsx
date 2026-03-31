import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="gqx-home">
      <section className="gqx-home-hero">
        <h1>GlobalQuantX</h1>
        <p>The institutional multi‑asset execution and risk platform.</p>
        <div className="gqx-home-cta-row">
          <a href="/login" className="gqx-btn-primary">Launch Control Plane</a>
          <a href="/pricing" className="gqx-btn-secondary">Request Institutional Access</a>
        </div>
      </section>

      <section className="gqx-home-products">
        <h2>Products</h2>
        <div className="gqx-home-product-grid">
          <div>
            <h3>Execution Desk</h3>
            <p>Route and execute across stocks, ETFs, bonds, crypto, commodities, and FX from a single surface.</p>
          </div>
          <div>
            <h3>Risk Center</h3>
            <p>Real‑time P&L, VaR, exposure, and stress testing across portfolios and venues.</p>
          </div>
          <div>
            <h3>Liquidity Engine</h3>
            <p>Smart order routing, internalization, and venue selection tuned for latency and fill quality.</p>
          </div>
        </div>
      </section>

      <section className="gqx-home-contact">
        <h2>Talk to Us</h2>
        <p>For institutional onboarding, integrations, and partnerships:</p>
        <p>
          <a href="mailto:sales@globalquantx.com">sales@globalquantx.com</a> ·{" "}
          <a href="mailto:partners@globalquantx.com">partners@globalquantx.com</a>
        </p>
        <p>For support and operations:</p>
        <p>
          <a href="mailto:support@globalquantx.com">support@globalquantx.com</a> ·{" "}
          <a href="mailto:ops@globalquantx.com">ops@globalquantx.com</a>
        </p>
      </section>
    </div>
  );
}


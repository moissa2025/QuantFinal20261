import React from "react";
import "./landing.css";
import "../../styles/layout.css";
import { Helmet } from "react-helmet";

export default function Landing() {
  return (
    <div className="gqx-landing">

      <Helmet>
        <title>GlobalQuantX — Institutional Trading Platform</title>
        <meta
          name="description"
          content="Multi‑asset execution, risk, and routing for institutional and advanced retail traders."
        />
        <meta property="og:title" content="GlobalQuantX" />
        <meta
          property="og:description"
          content="Institutional multi‑asset trading and risk platform."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* RISK BANNER */}
      <div className="gqx-risk-banner">
        Trading in digital assets involves significant risk. You should not
        invest unless you are prepared to lose all the money you invest.
      </div>

      {/* HERO */}
      <section className="gqx-landing-hero">
        <div className="gqx-landing-assets">
          <div className="gqx-landing-asset">₿</div>
          <div className="gqx-landing-asset">Ξ</div>
          <div className="gqx-landing-asset">₣</div>
          <div className="gqx-landing-asset">📈</div>
        </div>

        <h1>Trade Beyond Boundaries</h1>
        <p>
          The institutional multi‑asset execution and risk platform — engineered
          for speed, precision, and operational clarity.
        </p>

        <a href="/login" className="gqx-landing-cta">Sign In</a>
      </section>

      {/* TRUSTED BY */}
      <section className="gqx-trusted">
        <p>Trusted by desks across:</p>
        <div className="gqx-trusted-logos">
          <span>Hedge Funds</span>
          <span>Prime Brokers</span>
          <span>Market Makers</span>
          <span>Quant Firms</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="gqx-landing-features">
        <div className="gqx-feature">
          <h3>Ultra‑Low Latency</h3>
          <p>&lt; 5 ms internal routing engine.</p>
        </div>
        <div className="gqx-feature">
          <h3>Multi‑Asset Coverage</h3>
          <p>Crypto, FX, equities, ETFs — all in one desk.</p>
        </div>
        <div className="gqx-feature">
          <h3>Institutional Security</h3>
          <p>MFA, SSO, audit trails, and full compliance.</p>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="gqx-screenshots">
        <h2>Platform Overview</h2>
        <div className="gqx-screenshot-grid">
          <div className="gqx-screenshot-card">Dashboard</div>
          <div className="gqx-screenshot-card">Risk Center</div>
          <div className="gqx-screenshot-card">Execution Engine</div>
        </div>
      </section>

      {/* WHY */}
      <section className="gqx-landing-why">
        <h2>Why GlobalQuantX?</h2>
        <div className="gqx-why-grid">
          <div>
            <h4>Unified Control Plane</h4>
            <p>Trading, risk, system health, and client operations — all in one surface.</p>
          </div>
          <div>
            <h4>Execution‑Grade Infrastructure</h4>
            <p>Built for desks that demand reliability, speed, and precision.</p>
          </div>
          <div>
            <h4>Security at the Core</h4>
            <p>MFA, SSO, audit trails, and full compliance baked into the platform.</p>
          </div>
        </div>
      </section>

    </div>
  );
}


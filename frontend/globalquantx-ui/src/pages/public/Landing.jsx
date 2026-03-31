import React from "react";
import "./landing.css";

export default function Landing() {
  return (
    <div className="gqx-landing">
       <div className="gqx-landing-asset">₿</div>
  <div className="gqx-landing-asset">Ξ</div>
  <div className="gqx-landing-asset">₣</div>
  <div className="gqx-landing-asset">📈</div>
      {/* HERO SECTION */}
      <section className="gqx-landing-hero">
        <h1>Trade Beyond Boundaries</h1>
        <p>The institutional multi‑asset execution and risk platform.</p>
        <a href="/login" className="gqx-landing-cta">Sign In</a>
      </section>

      {/* FEATURE GRID */}
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


import React from "react";
import "./about.css";

export default function About() {
  return (
    <div className="gqx-about">
      <h1>About GlobalQuantX</h1>
      <p className="gqx-about-lead">
        GlobalQuantX is a control plane for institutional and advanced retail traders operating across global markets.
      </p>

      <section className="gqx-about-section">
        <h2>Mission</h2>
        <p>
          To unify execution, risk, and operations into a single, coherent surface that lets desks move faster
          without compromising control, compliance, or security.
        </p>
      </section>

      <section className="gqx-about-section">
        <h2>Coverage</h2>
        <p>
          From stocks, ETFs, and bonds to crypto, commodities, and FX, GlobalQuantX is designed for multi‑asset
          workflows and cross‑product hedging.
        </p>
      </section>

      <section className="gqx-about-section">
        <h2>Contact</h2>
        <p>
          General enquiries: <a href="mailto:hello@globalquantx.com">hello@globalquantx.com</a>
          <br />
          Institutional onboarding: <a href="mailto:institutions@globalquantx.com">institutions@globalquantx.com</a>
        </p>
      </section>
    </div>
  );
}


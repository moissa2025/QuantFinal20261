import React from "react";
import "./contact.css";

export default function Contact() {
  return (
    <div className="gqx-contact">
      <h1>Contact GlobalQuantX</h1>
      <p className="gqx-contact-lead">
        Whether you’re an institutional desk, a partner, or an advanced trader, we’d love to talk.
      </p>

      <section className="gqx-contact-section">
        <h2>Institutional & Broker‑Dealer</h2>
        <p>
          Onboarding, integrations, and commercial discussions:
          <br />
          <a href="mailto:sales@globalquantx.com">sales@globalquantx.com</a>
        </p>
      </section>

      <section className="gqx-contact-section">
        <h2>Partnerships & OEM</h2>
        <p>
          White‑label, OEM, and strategic partnerships:
          <br />
          <a href="mailto:partners@globalquantx.com">partners@globalquantx.com</a>
        </p>
      </section>

      <section className="gqx-contact-section">
        <h2>Support & Operations</h2>
        <p>
          Platform issues, incidents, and operational queries:
          <br />
          <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>
      </section>
    </div>
  );
}


import React from "react";

export default function PublicSupport() {
  return (
    <main className="-public-support">

      <h1>Support</h1>
      <p>
        For trading incidents, platform issues, or urgent operational queries,
        please contact the appropriate institutional mailbox below.
      </p>
    
      <footer className="global-footer">
        <p>
          Alerts: <a href="mailto:alerts@globalquantx.com">alerts@globalquantx.com</a> |
          {" "}Trading Desk: <a href="mailto:trading@globalquantx.com">trading@globalquantx.com</a> |
          {" "}Support: <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>

      <section className="contact-extended">
        <h3>Institutional Contacts</h3>
        <ul>
          <li>Onboarding: <a href="mailto:onboarding@globalquantx.com">onboarding@globalquantx.com</a></li>
          <li>Operations: <a href="mailto:ops@globalquantx.com">ops@globalquantx.com</a></li>
          <li>Compliance: <a href="mailto:compliance@globalquantx.com">compliance@globalquantx.com</a></li>
          <li>Principal: <a href="mailto:mohamed.issa@globalquantx.com">mohamed.issa@globalquantx.com</a></li>
        </ul>
      </section>
    
      </footer>
    </main>
  );
}

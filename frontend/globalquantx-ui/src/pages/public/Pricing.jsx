import React from "react";
import "./pricing.css";

export default function Pricing() {
  return (
    <div className="gqx-pricing">
      <h1>Institutional Onboarding</h1>
      <p className="gqx-pricing-sub">Choose the access tier that fits your desk.</p>

      <div className="gqx-pricing-grid">

        <div className="gqx-pricing-card">
          <h3>Guest Access</h3>
          <p className="gqx-price">Free</p>
          <ul>
            <li>Read‑only dashboards</li>
            <li>Market data preview</li>
            <li>Limited risk tools</li>
          </ul>
          <a href="/login" className="gqx-pricing-btn">Start</a>
        </div>

        <div className="gqx-pricing-card gqx-pricing-pro">
          <h3>Institutional</h3>
          <p className="gqx-price">Contact Sales</p>
          <ul>
            <li>Full multi‑asset execution</li>
            <li>Risk center + OMS</li>
            <li>SSO + MFA + audit trails</li>
            <li>Dedicated support</li>
          </ul>
          <a href="/support" className="gqx-pricing-btn">Request Access</a>
        </div>

      </div>
    </div>
  );
}


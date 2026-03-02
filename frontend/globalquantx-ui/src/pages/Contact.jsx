import React from "react";
import Page from "../components/layout/Page.jsx";

const Contact = () => {
  return (
    <Page title="Contact" subtitle="Reach the GlobalQuantX team">
      <p>
        For institutional onboarding, technical integration, or partnership inquiries, please contact:
      </p>
      <p style={{ marginTop: 10, color: "var(--text)" }}>
        <strong>Email:</strong> consulting@globalquantx.com
      </p>
      <p style={{ marginTop: 10 }}>
        We typically respond within 24–48 hours for institutional clients and partners.
      </p>
    </Page>
  );
};

export default Contact;


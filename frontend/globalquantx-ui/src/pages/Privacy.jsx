import React from "react";
import Page from "../components/layout/Page.jsx";

const Privacy = () => {
  return (
    <Page title="Privacy Policy" subtitle="How we handle data and confidentiality">
      <p>
        GlobalQuantX is designed with confidentiality and data minimization in mind. Only the information required for
        onboarding, compliance, and platform operation is collected.
      </p>
      <p style={{ marginTop: 10 }}>
        Client data may be processed for identity verification, transaction monitoring, risk management, and regulatory
        reporting. Data is stored securely and access is restricted to authorized personnel and systems.
      </p>
      <p style={{ marginTop: 10 }}>
        Where applicable, data handling practices aim to align with relevant data protection regulations. Specific
        obligations may vary by jurisdiction and client classification.
      </p>
    </Page>
  );
};

export default Privacy;


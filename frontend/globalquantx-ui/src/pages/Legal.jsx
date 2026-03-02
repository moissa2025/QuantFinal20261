import React from "react";
import Page from "../components/layout/Page.jsx";

const Legal = () => {
  return (
    <Page title="Legal & Compliance" subtitle="Regulatory posture and usage constraints">
      <p>
        GlobalQuantX is designed for professional and institutional clients only. The platform is not intended for
        retail investors and does not constitute investment advice, solicitation, or an offer to the public.
      </p>
      <p style={{ marginTop: 10 }}>
        Access to certain instruments, venues, and strategies may be restricted based on jurisdiction, regulatory
        status, or internal risk policies. All activity may be subject to monitoring, recording, and reporting in line
        with applicable regulations.
      </p>
      <p style={{ marginTop: 10 }}>
        Before onboarding, clients may be required to complete KYC/AML checks, suitability assessments, and provide
        documentation regarding their regulatory classification and risk profile.
      </p>
    </Page>
  );
};

export default Legal;


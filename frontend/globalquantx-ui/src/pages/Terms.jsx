import React from "react";
import Page from "../components/layout/Page.jsx";

const Terms = () => {
  return (
    <Page title="Terms of Service" subtitle="Conditions for accessing and using GlobalQuantX">
      <p>
        Use of GlobalQuantX is subject to acceptance of these terms. By accessing the platform, you confirm that you are
        authorized to act on behalf of a professional or institutional entity and that you comply with all applicable
        laws and regulations.
      </p>
      <p style={{ marginTop: 10 }}>
        The platform is provided on a best‑efforts basis. No guarantee is made regarding uninterrupted access, latency,
        or execution outcomes. Strategies and orders remain the responsibility of the client.
      </p>
      <p style={{ marginTop: 10 }}>
        Certain features, instruments, or venues may be modified, restricted, or withdrawn at any time in response to
        market conditions, regulatory changes, or internal risk policies.
      </p>
    </Page>
  );
};

export default Terms;


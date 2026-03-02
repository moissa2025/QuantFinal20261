import React from "react";
import Page from "../components/layout/Page.jsx";

const About = () => {
  return (
    <Page
      title="About GlobalQuantX"
      subtitle="Institutional multi‑asset algorithmic trading, built by Bass Industries LTD."
    >
      <p>
        GlobalQuantX is an institutional‑grade trading platform designed for professional and regulated entities
        operating across crypto, FX, equities, and ETFs.
      </p>
      <p style={{ marginTop: 10 }}>
        The platform is engineered around audited ledger flows, risk‑aware execution, and low‑latency routing across
        multiple venues. Every subsystem—market‑data, trading, risk, ledger, and reconciliation—is designed to be
        observable, testable, and compliant.
      </p>
      <p style={{ marginTop: 10 }}>
        GlobalQuantX is operated by <strong>Bass Industries LTD</strong> — Company Registration: <strong>17018032</strong>.
      </p>
    </Page>
  );
};

export default About;


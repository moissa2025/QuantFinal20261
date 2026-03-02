import React from "react";
import Page from "../components/layout/Page.jsx";

const Ledger = () => {
  return (
    <Page title="Ledger" subtitle="Audited double‑entry transaction history">
      <p>
        This page will expose the underlying double‑entry ledger: accounts, postings, and journal entries, with filters
        by entity, strategy, and instrument.
      </p>
      <p style={{ marginTop: 10 }}>
        It will be powered by <strong>ledger-service</strong> and designed for auditability and reconciliation.
      </p>
    </Page>
  );
};

export default Ledger;


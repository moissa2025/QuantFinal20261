import React from "react";
import Page from "../components/layout/Page.jsx";

const Status = () => {
  return (
    <Page title="System Status" subtitle="High‑level view of platform health">
      <p>
        This page will surface the health of core services: API gateway, market‑data, trading, ledger, risk, and
        authentication.
      </p>
      <p style={{ marginTop: 10 }}>
        It can be wired to internal health checks and observability tooling to provide a live operational view.
      </p>
    </Page>
  );
};

export default Status;


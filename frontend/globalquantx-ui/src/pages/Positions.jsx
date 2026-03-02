import React from "react";
import Page from "../components/layout/Page.jsx";

const Positions = () => {
  return (
    <Page title="Positions & PnL" subtitle="Live exposures and realized/unrealized performance">
      <p>
        This view will consolidate positions across instruments, venues, and strategies, with real‑time PnL and
        exposure metrics.
      </p>
      <p style={{ marginTop: 10 }}>
        Data will be sourced from <strong>ledger-service</strong>, <strong>trading-service</strong>, and{" "}
        <strong>risk-service</strong>.
      </p>
    </Page>
  );
};

export default Positions;


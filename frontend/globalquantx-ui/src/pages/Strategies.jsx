import React from "react";
import Page from "../components/layout/Page.jsx";

const Strategies = () => {
  return (
    <Page title="Strategies" subtitle="Algorithmic strategies and deployment states">
      <p>
        This page will list algorithmic strategies, their parameters, deployment environments, and current status
        (live, paused, sandbox).
      </p>
      <p style={{ marginTop: 10 }}>
        It can be wired to a dedicated <strong>strategy-service</strong> or integrated into{" "}
        <strong>trading-service</strong> and <strong>risk-service</strong>.
      </p>
    </Page>
  );
};

export default Strategies;


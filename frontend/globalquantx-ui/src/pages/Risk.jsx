import React from "react";
import Page from "../components/layout/Page.jsx";

const Risk = () => {
  return (
    <Page title="Risk" subtitle="Limits, exposures, and real‑time controls">
      <p>
        This view will surface risk metrics: limits, VaR, stress scenarios, and concentration checks across portfolios
        and strategies.
      </p>
      <p style={{ marginTop: 10 }}>
        It will integrate with <strong>risk-service</strong> and <strong>market-data-service</strong> for live
        recalculation.
      </p>
    </Page>
  );
};

export default Risk;


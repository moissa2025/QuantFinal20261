import React from "react";
import Page from "../components/layout/Page.jsx";

const Support = () => {
  return (
    <Page title="Support" subtitle="Operational and technical assistance">
      <p>
        For operational issues, technical integration, or incident reports, please reach out via{" "}
        <strong>consulting@globalquantx.com</strong>.
      </p>
      <p style={{ marginTop: 10 }}>
        In a future iteration, this page can integrate with a ticketing system and show open/closed cases.
      </p>
    </Page>
  );
};

export default Support;


import React from "react";
import Page from "../components/layout/Page.jsx";

const ApiDocs = () => {
  return (
    <Page title="API Documentation" subtitle="Programmatic access to GlobalQuantX">
      <p>
        This page will describe REST and WebSocket endpoints for programmatic access to trading, market‑data, and
        account information.
      </p>
      <p style={{ marginTop: 10 }}>
        It can be backed by OpenAPI definitions from the <strong>api-gateway</strong> and individual microservices.
      </p>
    </Page>
  );
};

export default ApiDocs;


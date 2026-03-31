import React from "react";

export default function ApiResponse({ response, loading, error }) {
  return (
    <div className="gqx-api-response">
      <h3>Response</h3>
      {loading && <p>Sending request…</p>}
      {error && <p className="gqx-api-error">{error}</p>}
      {!loading && !error && response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
      {!loading && !error && !response && (
        <p>No response yet. Configure and send a request.</p>
      )}
    </div>
  );
}


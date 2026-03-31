import React from "react";

export default function ApiConsole({ endpoint, onSend, body, setBody, apiKey, setApiKey }) {
  return (
    <div className="gqx-api-console">
      <h3>{endpoint.method} {endpoint.path}</h3>
      <p className="gqx-api-desc">{endpoint.description}</p>

      <label>API Key</label>
      <input
        type="password"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="sk_live_..."
      />

      {endpoint.supportsBody && (
        <>
          <label>Request Body (JSON)</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={6}
          />
        </>
      )}

      <button onClick={onSend} className="gqx-api-send">Send Request</button>
    </div>
  );
}


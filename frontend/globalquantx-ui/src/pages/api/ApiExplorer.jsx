import React from "react";
import "./api-explorer.css";
import ApiSidebar from "./ApiSidebar.jsx";
import ApiConsole from "./ApiConsole.jsx";
import ApiResponse from "./ApiResponse.jsx";

const ENDPOINTS = [
  {
    id: "get-positions",
    method: "GET",
    path: "/v1/positions",
    description: "Retrieve open positions across stocks, ETFs, bonds, crypto, commodities, and FX.",
    supportsBody: false
  },
  {
    id: "place-order",
    method: "POST",
    path: "/v1/orders",
    description: "Place a new order across supported asset classes.",
    supportsBody: true,
    sampleBody: JSON.stringify({
      symbol: "AAPL",
      side: "BUY",
      quantity: 100,
      venue: "XNAS"
    }, null, 2)
  },
  {
    id: "get-risk",
    method: "GET",
    path: "/v1/risk",
    description: "Get portfolio‑level risk metrics and exposures.",
    supportsBody: false
  }
];

export default function ApiExplorer() {
  const [selected, setSelected] = React.useState(ENDPOINTS[0]);
  const [body, setBody] = React.useState(ENDPOINTS[1].sampleBody || "");
  const [apiKey, setApiKey] = React.useState("");
  const [response, setResponse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSend = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      // Placeholder: in production, point to your real API gateway
      const res = await fetch("https://api.globalquantx.com" + selected.path, {
        method: selected.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": apiKey ? `Bearer ${apiKey}` : ""
        },
        body: selected.supportsBody ? body : undefined
      });

      const json = await res.json().catch(() => ({}));
      setResponse(json);
    } catch (e) {
      setError("Unable to reach API endpoint in this environment.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selected.supportsBody && selected.sampleBody) {
      setBody(selected.sampleBody);
    } else {
      setBody("");
    }
  }, [selected]);

  return (
    <div className="gqx-api-explorer">
      <ApiSidebar
        endpoints={ENDPOINTS}
        selected={selected}
        onSelect={setSelected}
      />
      <div className="gqx-api-main">
        <ApiConsole
          endpoint={selected}
          onSend={handleSend}
          body={body}
          setBody={setBody}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
        <ApiResponse
          response={response}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}


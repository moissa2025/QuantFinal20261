import { useState } from "react";

export default function DeveloperPlayground() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/v1/markets");
  const [requestBody, setRequestBody] = useState("{\n  \n}");
  const [response, setResponse] = useState("// Response will appear here");

  function simulateRequest() {
    // Simulated response for UI only
    const mock = {
      "/v1/markets": [
        { symbol: "BTCUSD", price: 68200 },
        { symbol: "ETHUSD", price: 3420 }
      ],
      "/v1/account": {
        balance: 1248920,
        positions: 3,
        openOrders: 1
      },
      "/v1/order": {
        status: "accepted",
        id: "order_12345"
      }
    };

    setResponse(JSON.stringify(mock[endpoint] || { message: "OK" }, null, 2));
  }

  return (
    <div className="playground-container">

      {/* HEADER */}
      <div className="playground-header">
        <h1>Developer Playground</h1>
        <p>Test API requests directly from your browser.</p>
      </div>

      {/* REQUEST BUILDER */}
      <div className="playground-panel">
        <h2>Request</h2>

        <div className="playground-row">
          <div className="playground-item">
            <label>Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>GET</option>
              <option>POST</option>
              <option>DELETE</option>
            </select>
          </div>

          <div className="playground-item">
            <label>Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>
        </div>

        <label>Request Body</label>
        <textarea
          className="playground-textarea"
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
        />

        <button className="playground-btn" onClick={simulateRequest}>
          Send Request
        </button>
      </div>

      {/* RESPONSE VIEWER */}
      <div className="playground-panel">
        <h2>Response</h2>

        <pre className="playground-response">
{response}
        </pre>
      </div>

      {/* WEBSOCKET TESTER */}
      <div className="playground-panel">
        <h2>WebSocket Tester</h2>

        <p>Simulated subscription preview:</p>

        <pre className="playground-response">
{`wss://api.globalquantx.com/stream

Subscribed Channels:
- ticker
- orderbook
- trades

Sample Message:
{
  "type": "ticker",
  "symbol": "BTCUSD",
  "price": 68200
}`}
        </pre>
      </div>

    </div>
  );
}


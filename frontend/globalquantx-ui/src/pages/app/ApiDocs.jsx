export default function ApiDocs() {
  return (
    <div className="api-container">

      {/* HEADER */}
      <div className="api-header">
        <h1>GlobalQuantX API Documentation</h1>
        <p>REST & WebSocket API for trading, market data, and account management.</p>
      </div>

      {/* AUTHENTICATION */}
      <div className="api-section">
        <h2>Authentication</h2>
        <p>
          All API requests require authentication using your API key and secret.
          Include them in the request headers as shown below.
        </p>

        <pre className="code-block">
{`GET /v1/account
Headers:
  X-API-KEY: your_public_key
  X-API-SECRET: your_secret_key`}
        </pre>
      </div>

      {/* REST ENDPOINTS */}
      <div className="api-section">
        <h2>REST Endpoints</h2>

        <div className="endpoint">
          <h3>GET /v1/markets</h3>
          <p>Returns a list of tradable markets.</p>
          <pre className="code-block">
{`Response:
[
  { "symbol": "BTCUSD", "price": 68200 },
  { "symbol": "ETHUSD", "price": 3420 }
]`}
          </pre>
        </div>

        <div className="endpoint">
          <h3>POST /v1/order</h3>
          <p>Places a new order.</p>
          <pre className="code-block">
{`Request:
{
  "symbol": "BTCUSD",
  "side": "buy",
  "size": 0.5
}`}
          </pre>
        </div>

        <div className="endpoint">
          <h3>GET /v1/orders/open</h3>
          <p>Returns all open orders for the authenticated user.</p>
        </div>
      </div>

      {/* WEBSOCKET */}
      <div className="api-section">
        <h2>WebSocket Streams</h2>
        <p>Subscribe to real‑time market data and trade events.</p>

        <pre className="code-block">
{`wss://api.globalquantx.com/stream

Subscribe:
{
  "type": "subscribe",
  "channels": ["ticker", "orderbook", "trades"]
}`}
        </pre>
      </div>

      {/* ERROR CODES */}
      <div className="api-section">
        <h2>Error Codes</h2>

        <table className="api-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1001</td>
              <td>Invalid API key</td>
            </tr>
            <tr>
              <td>2002</td>
              <td>Insufficient balance</td>
            </tr>
            <tr>
              <td>3003</td>
              <td>Order size exceeds limit</td>
            </tr>
            <tr>
              <td>4004</td>
              <td>Symbol not found</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SANDBOX */}
      <div className="api-section">
        <h2>Sandbox Environment</h2>
        <p>
          Use the sandbox environment for testing without affecting your live account.
        </p>

        <pre className="code-block">
{`Base URL:
https://sandbox.globalquantx.com/api`}
        </pre>
      </div>

    </div>
  );
}


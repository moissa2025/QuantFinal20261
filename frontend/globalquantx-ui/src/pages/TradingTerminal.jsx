import React, { useEffect, useState } from "react";

const TradingTerminal = () => {
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [side, setSide] = useState("BUY");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [orders, setOrders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [book, setBook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://api.globalquantx.com/terminal/stream?symbol=${encodeURIComponent(symbol)}`
    );
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "book") setBook(data.payload);
        if (data.type === "trade") setTrades((t) => [data.payload, ...t].slice(0, 50));
        if (data.type === "position") setPositions(data.payload);
        if (data.type === "order") setOrders(data.payload);
      } catch (e) {}
    };
    return () => ws.close();
  }, [symbol]);

  const submitOrder = () => {
    fetch("https://api.globalquantx.com/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, side, size: Number(size), price: Number(price) }),
    }).catch(() => {});
  };

  return (
    <div>
      <h1 className="dashboard-title">Trading Terminal</h1>
      <p className="dashboard-sub">
        Multi‑asset execution wired to your Rust aggregation and routing engine.
      </p>

      <div className="terminal-layout">
        {/* LEFT: ORDER ENTRY */}
        <div className="terminal-panel">
          <div className="terminal-panel-title">Order entry</div>
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <div className="field-label">Symbol</div>
              <input
                className="field-input"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div>
              <div className="field-label">Side</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {["BUY", "SELL"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.16)",
                      background:
                        side === s
                          ? s === "BUY"
                            ? "rgba(0,229,138,0.18)"
                            : "rgba(255,77,106,0.18)"
                          : "transparent",
                      color: "#f8faff",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="field-label">Size</div>
              <input
                className="field-input"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 0.5"
              />
            </div>
            <div>
              <div className="field-label">Limit price</div>
              <input
                className="field-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 42358.82"
              />
            </div>
            <button type="button" className="btn-primary" onClick={submitOrder}>
              Submit order
            </button>
          </div>
        </div>

        {/* MIDDLE: CHART PLACEHOLDER */}
        <div className="terminal-panel">
          <div className="terminal-panel-title">Price chart</div>
          <div
            style={{
              height: "100%",
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa3b8",
              fontSize: 12,
            }}
          >
            Integrate TradingView / custom chart here.
          </div>
        </div>

        {/* RIGHT: ORDER BOOK + TRADES */}
        <div className="terminal-panel">
          <div className="terminal-panel-title">Order book</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
            <div>
              <div style={{ marginBottom: 4, color: "#9aa3b8" }}>Bids</div>
              {book.bids.slice(0, 15).map((b, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{b.price}</span>
                  <span>{b.size}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ marginBottom: 4, color: "#9aa3b8" }}>Asks</div>
              {book.asks.slice(0, 15).map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{a.price}</span>
                  <span>{a.size}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div className="terminal-panel-title">Recent trades</div>
            <div style={{ maxHeight: 160, overflowY: "auto", fontSize: 12 }}>
              {trades.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: t.side === "BUY" ? "#00e58a" : "#ff4d6a",
                  }}
                >
                  <span>{t.price}</span>
                  <span>{t.size}</span>
                  <span>{t.side}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM: POSITIONS + ORDERS */}
        <div className="terminal-panel" style={{ gridColumn: "1 / span 2" }}>
          <div className="terminal-panel-title">Positions</div>
          <table className="public-markets-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Size</th>
                <th>Entry</th>
                <th>Mark</th>
                <th>Unrealised PnL</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.symbol}>
                  <td>{p.symbol}</td>
                  <td>{p.side}</td>
                  <td>{p.size}</td>
                  <td>{p.entry}</td>
                  <td>{p.mark}</td>
                  <td className={p.pnl >= 0 ? "up" : "down"}>{p.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="terminal-panel">
          <div className="terminal-panel-title">Open orders</div>
          <table className="public-markets-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Size</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.symbol}</td>
                  <td>{o.side}</td>
                  <td>{o.size}</td>
                  <td>{o.price}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;


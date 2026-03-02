import React, { useEffect, useState } from "react";

const initialRows = [];

const MarketData = () => {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Snapshot via REST from your Rust backend
    fetch("https://api.globalquantx.com/market-data/snapshot")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch(() => {});

    // Live updates via WebSocket from your Rust backend
    const ws = new WebSocket("wss://api.globalquantx.com/market-stream");
    ws.onmessage = (msg) => {
      try {
        const update = JSON.parse(msg.data);
        setRows((prev) => {
          const map = new Map(prev.map((r) => [r.symbol, r]));
          update.forEach((u) => map.set(u.symbol, { ...map.get(u.symbol), ...u }));
          return Array.from(map.values());
        });
      } catch (e) {}
    };
    return () => ws.close();
  }, []);

  const filtered = rows.filter((r) => {
    const typeMatch = filter === "All" || r.type === filter;
    const searchMatch =
      !search ||
      r.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (r.name || "").toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <div>
      <h1 className="dashboard-title">Market Data</h1>
      <p className="dashboard-sub">
        Live multi‑asset market view powered by your Rust aggregation engine.
      </p>

      <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
        <input
          className="field-input"
          style={{ maxWidth: 260 }}
          placeholder="Search by symbol or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="public-market-filters">
          {["All", "Crypto", "FX", "ETF", "Index", "Commodity"].map((f) => (
            <button
              key={f}
              className={`public-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="public-markets-table-wrapper">
        <table className="public-markets-table">
          <thead>
            <tr>
              <th>Market</th>
              <th>Type</th>
              <th>Last Price</th>
              <th>24h Change</th>
              <th>Volume / Venue</th>
              <th>Market Context</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.symbol}>
                <td>
                  <div className="public-market-symbol">
                    <span className="public-market-symbol-main">{r.symbol}</span>
                    <span className="public-market-symbol-sub">{r.name}</span>
                  </div>
                </td>
                <td>{r.type}</td>
                <td>{r.price}</td>
                <td className={r.changePct >= 0 ? "up" : "down"}>
                  {r.changePct >= 0 ? "+" : ""}
                  {r.changePct}%
                </td>
                <td>{r.volume}</td>
                <td>{r.mcap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketData;


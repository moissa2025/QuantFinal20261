import React, { useState } from "react";
import { Link } from "react-router-dom";

const rows = [
  // Crypto
  { symbol: "BTC/USDT", name: "Bitcoin", type: "Crypto", price: "42,358.82", changePct: 0.24, volume: "18,327 BTC", mcap: "$830B" },
  { symbol: "ETH/USDT", name: "Ethereum", type: "Crypto", price: "2,315.55", changePct: -0.12, volume: "220K ETH", mcap: "$280B" },
  { symbol: "SOL/USDT", name: "Solana", type: "Crypto", price: "98.22", changePct: 1.02, volume: "12M SOL", mcap: "$42B" },
  { symbol: "XRP/USDT", name: "XRP", type: "Crypto", price: "0.62", changePct: 0.18, volume: "980M XRP", mcap: "$33B" },
  { symbol: "LINK/USDT", name: "Chainlink", type: "Crypto", price: "17.45", changePct: -0.08, volume: "18M LINK", mcap: "$10B" },

  // FX
  { symbol: "EUR/USD", name: "Euro vs US Dollar", type: "FX", price: "1.0836", changePct: -0.04, volume: "ECN", mcap: "G10" },
  { symbol: "GBP/USD", name: "British Pound vs US Dollar", type: "FX", price: "1.2722", changePct: 0.03, volume: "ECN", mcap: "G10" },
  { symbol: "USD/JPY", name: "US Dollar vs Japanese Yen", type: "FX", price: "147.32", changePct: 0.12, volume: "ECN", mcap: "G10" },

  // ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF", type: "ETF", price: "474.36", changePct: 0.04, volume: "68M", mcap: "$450B" },
  { symbol: "QQQ", name: "Invesco QQQ", type: "ETF", price: "392.12", changePct: 0.11, volume: "52M", mcap: "$220B" },

  // Indices
  { symbol: "FTSE 100", name: "FTSE 100 Index", type: "Index", price: "7,423.12", changePct: -0.07, volume: "-", mcap: "UK Large Cap" },
  { symbol: "S&P 500", name: "S&P 500 Index", type: "Index", price: "4,782.45", changePct: 0.09, volume: "-", mcap: "US Large Cap" },

  // Commodities
  { symbol: "XAU/USD", name: "Gold", type: "Commodity", price: "2,132.55", changePct: 0.32, volume: "-", mcap: "-" },
  { symbol: "XAG/USD", name: "Silver", type: "Commodity", price: "24.12", changePct: -0.21, volume: "-", mcap: "-" },
];

const FILTERS = ["All", "Crypto", "FX", "ETF", "Index", "Commodity"];

const PublicMarketsTable = () => {
  const [filter, setFilter] = useState("All");

  const filteredRows =
    filter === "All" ? rows : rows.filter((r) => r.type === filter);

  return (
    <div className="public-markets-table-wrapper">

      {/* FILTER BUTTONS */}
      <div className="public-market-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`public-filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* MARKETS TABLE */}
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
          {filteredRows.map((r) => (
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

      {/* VIEW MORE LINK */}
      <div className="public-view-more">
        <Link to="/market-data">View full market data →</Link>
      </div>
    </div>
  );
};

export default PublicMarketsTable;


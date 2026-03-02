import React, { useEffect, useState } from "react";
import MarketTile from "./MarketTile.jsx";
import { createMarketSocket } from "../../api/marketSocket";

const initialMarkets = {
  "BTC-USD": {
    symbol: "BTC-USD",
    kind: "crypto",
    price: "$42,150.25",
    changePct: 2.34,
    meta: {
      left: { label: "24h vol", value: "18,240 BTC" },
      right: { label: "Venue", value: "Multi‑venue" },
    },
  },
  "EUR-USD": {
    symbol: "EUR-USD",
    kind: "fx",
    price: "1.0874",
    changePct: -0.18,
    meta: {
      left: { label: "Spread", value: "0.3 pips" },
      right: { label: "Venue", value: "ECN" },
    },
  },
  AAPL: {
    symbol: "AAPL",
    kind: "stock",
    price: "$192.34",
    changePct: 0.84,
    meta: {
      left: { label: "Notional", value: "$4.2B" },
      right: { label: "Session", value: "NASDAQ" },
    },
  },
  SPY: {
    symbol: "SPY",
    kind: "etf",
    price: "$474.12",
    changePct: 0.32,
    meta: {
      left: { label: "ADV", value: "68M" },
      right: { label: "Beta", value: "1.00" },
    },
  },
};

const MarketsCard = () => {
  const [markets, setMarkets] = useState(initialMarkets);

  useEffect(() => {
    const socket = createMarketSocket((msg) => {
      setMarkets((prev) => {
        const existing = prev[msg.symbol] || { symbol: msg.symbol, kind: msg.kind || "other", meta: {} };
        let priceStr = msg.price;

        if (msg.kind === "crypto" || msg.kind === "stock" || msg.kind === "etf") {
          priceStr = "$" + msg.price.toFixed(2);
        } else if (msg.kind === "fx") {
          priceStr = msg.price.toFixed(4);
        }

        const meta = { ...existing.meta };

        if (msg.kind === "crypto" && msg.volume != null) {
          meta.left = { label: "24h vol", value: `${msg.volume.toLocaleString()} BTC` };
          meta.right = { label: "Venue", value: msg.venue || "Multi‑venue" };
        } else if (msg.kind === "fx" && msg.spread != null) {
          meta.left = { label: "Spread", value: `${msg.spread.toFixed(1)} pips` };
          meta.right = { label: "Venue", value: msg.venue || "ECN" };
        } else if (msg.kind === "stock" && msg.notional != null) {
          meta.left = { label: "Notional", value: `$${msg.notional.toFixed(1)}B` };
          meta.right = { label: "Session", value: msg.venue || "Primary" };
        } else if (msg.kind === "etf" && msg.adv != null) {
          meta.left = { label: "ADV", value: `${msg.adv.toFixed(0)}M` };
          meta.right = { label: "Beta", value: msg.beta?.toFixed(2) ?? "1.00" };
        }

        return {
          ...prev,
          [msg.symbol]: {
            ...existing,
            symbol: msg.symbol,
            kind: msg.kind || existing.kind,
            price: priceStr,
            changePct: msg.changePct ?? existing.changePct ?? 0,
            meta,
          },
        };
      });
    });

    return () => socket.close();
  }, []);

  const list = Object.values(markets);

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Real‑time multi‑asset tape</div>
          <div className="card-sub">
            Synthetic view across crypto, FX, stocks, and ETFs. Wire this to your market‑data‑service feeds.
          </div>
        </div>
        <div className="latency-pill">Feed: WebSocket</div>
      </div>

      <div className="markets-grid">
        {list.map((m) => (
          <MarketTile key={m.symbol} {...m} />
        ))}
      </div>

      <div className="market-strip">
        <div className="market-chip primary">Crypto: BTC, ETH, SOL, more</div>
        <div className="market-chip primary">FX: G10, EM, crosses</div>
        <div className="market-chip primary">Equities: US, EU, UK</div>
        <div className="market-chip primary">ETFs: index, sector, thematic</div>
        <div className="market-chip">Latency‑aware routing</div>
        <div className="market-chip">Venue‑smart order placement</div>
      </div>

      <div className="section-row">
        <div className="mini-card">
          <div className="mini-card-title">Execution quality</div>
          <div className="mini-metric">
            99.97% <span>fill rate on simulated institutional flow</span>
          </div>
        </div>
        <div className="mini-card">
          <div className="mini-card-title">Strategy capacity</div>
          <div className="mini-metric">
            250+ <span>concurrent strategies per environment</span>
          </div>
        </div>
        <div className="mini-card">
          <div className="mini-card-title">Risk envelope</div>
          <div className="mini-metric">
            Real‑time <span>limits, VaR, and exposure controls</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketsCard;


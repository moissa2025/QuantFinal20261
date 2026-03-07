import { useEffect, useRef } from "react";
import "./OrderBook.css";

export default function OrderBook({ bids = [], asks = [] }) {
  const prevBids = useRef([]);
  const prevAsks = useRef([]);

  // Detect changes for flash animation
  const detectChanges = (prev, next) => {
    const changes = {};
    next.forEach((row) => {
      const prevRow = prev.find((p) => p.price === row.price);
      if (!prevRow) {
        changes[row.price] = "up"; // new liquidity
      } else if (prevRow.size !== row.size) {
        changes[row.price] = row.size > prevRow.size ? "up" : "down";
      }
    });
    return changes;
  };

  const bidChanges = detectChanges(prevBids.current, bids);
  const askChanges = detectChanges(prevAsks.current, asks);

  // Save previous snapshot
  useEffect(() => {
    prevBids.current = bids;
    prevAsks.current = asks;
  }, [bids, asks]);

  return (
    <div className="orderbook">
      {/* BIDS */}
      <div className="orderbook-column">
        <h3>Bids</h3>
        {bids.map((b) => (
          <div
            key={b.price}
            className={`orderbook-row ${bidChanges[b.price] || ""}`}
          >
            <div
              className="depth-bar bid"
              style={{ width: `${b.depth}%` }}
            />
            <span className="price bid">{b.price}</span>
            <span className="size">{b.size}</span>
          </div>
        ))}
      </div>

      {/* ASKS */}
      <div className="orderbook-column">
        <h3>Asks</h3>
        {asks.map((a) => (
          <div
            key={a.price}
            className={`orderbook-row ${askChanges[a.price] || ""}`}
          >
            <div
              className="depth-bar ask"
              style={{ width: `${a.depth}%` }}
            />
            <span className="price ask">{a.price}</span>
            <span className="size">{a.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


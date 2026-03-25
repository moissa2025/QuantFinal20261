import DockablePanel from "../../layout/DockablePanel.jsx";
import { useState, useEffect } from "react";
import Page from "../../components/layout/Page";

import PriceChart from "../../components/markets/PriceChart";
import OrderBook from "../../components/markets/OrderBook";
import TradeTape from "../../components/markets/TradeTape";

import { placeOrder, getOpenOrders } from "../../api/trading";
import { preTradeCheck } from "../../api/risk";
import { connectMarketStream } from "../../api/marketStream";

export default function Trading() {
  // ORDER ENTRY
  const [symbol, setSymbol] = useState("BTCUSD"    </DockablePanel>
  );
  const [size, setSize] = useState(1    </DockablePanel>
  );
  const [side, setSide] = useState("buy"    </DockablePanel>
  );
  const [status, setStatus] = useState(""    </DockablePanel>
  );

  // OPEN ORDERS
  const [orders, setOrders] = useState([]    </DockablePanel>
  );

  // LIVE MARKET DATA
  const [candles, setCandles] = useState([]    </DockablePanel>
  );
  const [bids, setBids] = useState([]    </DockablePanel>
  );
  const [asks, setAsks] = useState([]    </DockablePanel>
  );
  const [trades, setTrades] = useState([]    </DockablePanel>
  );

  // ⭐ POSITION ENGINE (Step 15)
  const [position, setPosition] = useState({
    symbol: "BTCUSD",
    size: 0,
    avgEntry: 0,
    realizedPnl: 0,
    unrealizedPnl: 0,
    markPrice: 0,
  }    </DockablePanel>
  );

  // ⭐ Step 3 — applyFill() goes HERE (inside component, above useEffect)
  function applyFill(side, qty, price) {
    setPosition((pos) => {
      let newSize = pos.size;
      let newAvg = pos.avgEntry;
      let realized = pos.realizedPnl;

      if (side === "buy") {
        if (pos.size >= 0) {
          newAvg = (pos.avgEntry * pos.size + price * qty) / (pos.size + qty    </DockablePanel>
  );
          newSize = pos.size + qty;
        } else {
          const closing = Math.min(qty, Math.abs(pos.size)    </DockablePanel>
  );
          realized += closing * (pos.avgEntry - price    </DockablePanel>
  );
          newSize = pos.size + qty;
          if (newSize > 0) newAvg = price;
        }
      }

      if (side === "sell") {
        if (pos.size <= 0) {
          newAvg =
            (Math.abs(pos.avgEntry * pos.size) + price * qty) /
            (Math.abs(pos.size) + qty    </DockablePanel>
  );
          newSize = pos.size - qty;
        } else {
          const closing = Math.min(qty, pos.size    </DockablePanel>
  );
          realized += closing * (price - pos.avgEntry    </DockablePanel>
  );
          newSize = pos.size - qty;
          if (newSize < 0) newAvg = price;
        }
      }

      return {
        ...pos,
        size: newSize,
        avgEntry: newAvg,
        realizedPnl: realized,
        unrealizedPnl: newSize * (pos.markPrice - newAvg),
      };
    }    </DockablePanel>
  );
  }

  // Load open orders once
  useEffect(() => {
    getOpenOrders().then(setOrders).catch(console.error    </DockablePanel>
  );
  }, []    </DockablePanel>
  );

  // ⭐ Step 2 — Mark‑to‑Market PnL updates go INSIDE this WebSocket handler
  useEffect(() => {
    const ws = connectMarketStream((msg) => {

      // --- CANDLE UPDATES ---
      if (msg.type === "candle") {
        const mark = msg.candle.close;

        setCandles((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last && last.time === msg.candle.time) {
            updated[updated.length - 1] = msg.candle;
          } else {
            updated.push(msg.candle    </DockablePanel>
  );
          }

          return updated.slice(-500    </DockablePanel>
  );
        }    </DockablePanel>
  );

        // ⭐ Update PnL engine
        setPosition((pos) => ({
          ...pos,
          markPrice: mark,
          unrealizedPnl: pos.size * (mark - pos.avgEntry),
        })    </DockablePanel>
  );
      }

      // --- ORDERBOOK UPDATES ---
      if (msg.type === "orderbook") {
        setBids(msg.bids || []    </DockablePanel>
  );
        setAsks(msg.asks || []    </DockablePanel>
  );
      }

      // --- TRADE TAPE UPDATES ---
      if (msg.type === "trade") {
        const mark = msg.trade.price;

        setTrades((prev) => [...prev.slice(-200), msg.trade]    </DockablePanel>
  );

        // ⭐ Update PnL engine
        setPosition((pos) => ({
          ...pos,
          markPrice: mark,
          unrealizedPnl: pos.size * (mark - pos.avgEntry),
        })    </DockablePanel>
  );
      }
    }    </DockablePanel>
  );

    return () => ws && ws.close(    </DockablePanel>
  );
  }, []    </DockablePanel>
  );

  // ORDER SUBMISSION
  async function submitOrder() {
    setStatus("Running risk checks..."    </DockablePanel>
  );

    try {
      await preTradeCheck({ symbol, size, side }    </DockablePanel>
  );
      setStatus("Risk OK. Placing order..."    </DockablePanel>
  );

      await placeOrder({ symbol, size, side }    </DockablePanel>
  );
      setStatus("Order placed successfully!"    </DockablePanel>
  );

      // ⭐ Step 4 — Simulate fill using current mark price
      applyFill(side, size, position.markPrice    </DockablePanel>
  );

      const updated = await getOpenOrders(    </DockablePanel>
  );
      setOrders(updated    </DockablePanel>
  );
    } catch (err) {
      setStatus("Error: " + err.message    </DockablePanel>
  );
    }
  }

  return (
    <Page title="Trading Terminal">
      <div className="trading-grid">

        {/* LEFT COLUMN: CHART */}
        <div className="trading-column">
          <PriceChart candles={candles} />


        {/* MIDDLE COLUMN: ORDERBOOK + TRADE TAPE */}
        <div className="trading-column">
          <OrderBook bids={bids} asks={asks} />
          <TradeTape trades={trades} />


        {/* RIGHT COLUMN: ORDER ENTRY + POSITION + OPEN ORDERS */}
        <div className="trading-column">

          {/* ORDER ENTRY */}
          <div className="order-form">
            <h3>Order Entry</h3>

            <div className="order-form-row">
              <label>Symbol</label>
              <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />


            <div className="order-form-row">
              <label>Side</label>
              <select value={side} onChange={(e) => setSide(e.target.value)}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>


            <div className="order-form-row">
              <label>Size</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />


            <button onClick={submitOrder}>Submit Order</button>

            {status && <p style={{ marginTop: 8 }}>{status}</p>}


          {/* ⭐ Step 5 — Position Panel */}
          <div className="trading-positions">
            <h3>Position</h3>

            <p>Symbol: {position.symbol}</p>
            <p>Size: {position.size}</p>
            <p>Avg Entry: {position.avgEntry.toFixed(2)}</p>
            <p>Mark Price: {position.markPrice.toFixed(2)}</p>

            <p style={{ color: position.unrealizedPnl >= 0 ? "var(--success)" : "var(--danger)" }}>
              Unrealized PnL: {position.unrealizedPnl.toFixed(2)}
            </p>

            <p style={{ color: position.realizedPnl >= 0 ? "var(--success)" : "var(--danger)" }}>
              Realized PnL: {position.realizedPnl.toFixed(2)}
            </p>


          {/* OPEN ORDERS */}
          <div className="trading-positions">
            <h3>Open Orders</h3>
            {orders.length === 0 ? (
              <p>No open orders.</p>
            ) : (
              <ul>
                {orders.map((o) => (
                  <li key={o.id}>
                    {o.symbol} — {o.side} {o.size}
                  </li>
                ))}
              </ul>
            )}




</Page>
</DockablePanel>
  );
}


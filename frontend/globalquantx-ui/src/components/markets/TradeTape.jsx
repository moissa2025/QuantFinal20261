import { useEffect, useState } from "react";
import { connectMarketStream } from "../../api/marketStream";

import PriceChart from "../../components/markets/PriceChart";
import OrderBook from "../../components/markets/OrderBook";
import TradeTape from "../../components/markets/TradeTape";

export default function Trading() {
  // --- LIVE STATE ---
  const [candles, setCandles] = useState([]);
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [trades, setTrades] = useState([]);

  // --- CONNECT TO MARKET STREAM ---
  useEffect(() => {
    const ws = connectMarketStream((msg) => {
      // --- LIVE CANDLES ---
      if (msg.type === "candle") {
        setCandles((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          // Replace last candle if same timestamp
          if (last && last.time === msg.candle.time) {
            updated[updated.length - 1] = msg.candle;
          } else {
            updated.push(msg.candle);
          }

          return updated.slice(-500); // keep last 500 candles
        });
      }

      // --- LIVE ORDERBOOK ---
      if (msg.type === "orderbook") {
        setOrderbook({
          bids: msg.bids || [],
          asks: msg.asks || [],
        });
      }

      // --- LIVE TRADES ---
      if (msg.type === "trade") {
        setTrades((prev) => [...prev.slice(-200), msg.trade]); // keep last 200
      }
    });

    return () => ws.close();
  }, []);

  return (
    <div className="trading-page">
      {/* CHART */}
      <div className="chart-panel">
        <PriceChart candles={candles} />
      </div>

      <div className="market-panels">
        {/* ORDERBOOK */}
        <div className="orderbook-panel">
          <OrderBook bids={orderbook.bids} asks={orderbook.asks} />
        </div>

        {/* TRADE TAPE */}
        <div className="tradetape-panel">
          <TradeTape trades={trades} />
        </div>
      </div>
    </div>
  );
}


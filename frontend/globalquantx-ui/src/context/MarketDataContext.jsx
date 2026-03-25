import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const MarketDataContext = createContext(null);

const WS_URL = "wss://api.globalquantx.com/market-data/stream";
const SNAPSHOT_URL = "https://api.globalquantx.com/market-data/snapshot";

export function MarketDataProvider({ children }) {
  const [rows, setRows] = useState([]);
  const [bySymbol, setBySymbol] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      try {
        const res = await fetch(SNAPSHOT_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setRows(data);
        setBySymbol(
          data.reduce((acc, row) => {
            acc[row.symbol] = row;
            return acc;
          }, {})
        );
      } catch {}
    }

    loadSnapshot();

    let ws;
    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const snapshot = JSON.parse(event.data);
          setRows(snapshot);
          setBySymbol(
            snapshot.reduce((acc, row) => {
              acc[row.symbol] = row;
              return acc;
            }, {})
          );
        } catch {}
      };

      ws.onclose = () => {
        if (!cancelled) setConnected(false);
        setTimeout(() => {
          if (!cancelled) connect();
        }, 2000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      rows,
      bySymbol,
      connected,
    }),
    [rows, bySymbol, connected]
  );

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error("useMarketData must be used within MarketDataProvider");
  return ctx;
}


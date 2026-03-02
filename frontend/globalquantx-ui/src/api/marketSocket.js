const WS_URL = import.meta.env.VITE_MARKET_WS_URL || "ws://localhost:8100/ws/markets";

export function createMarketSocket(onMessage) {
  const socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "subscribe", symbols: ["BTC-USD", "EUR-USD", "AAPL", "SPY"] }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error("Invalid market data", e);
    }
  };

  socket.onerror = (err) => {
    console.error("Market socket error", err);
  };

  return socket;
}


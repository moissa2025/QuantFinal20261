export function connectMarketStream(onMessage) {
  const ws = new WebSocket("ws://localhost:8080/market/stream");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return ws;
}


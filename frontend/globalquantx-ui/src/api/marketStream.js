// src/api/marketStream.js

let socket = null;
let reconnectTimeout = 1000;
let heartbeatInterval = null;

export function connectMarketStream(onMessage) {
  function connect() {
    socket = new WebSocket("ws://localhost:8080/market/stream");

    socket.onopen = () => {
      console.log("[WS] Market stream connected");

      // Reset backoff
      reconnectTimeout = 1000;

      // Start heartbeat
      startHeartbeat();
    };

    socket.onclose = () => {
      console.log("[WS] Market stream disconnected");

      stopHeartbeat();

      // Reconnect with exponential backoff
      setTimeout(connect, reconnectTimeout);
      reconnectTimeout = Math.min(reconnectTimeout * 2, 10000);
    };

    socket.onerror = (err) => {
      console.error("[WS] Error:", err);
      socket.close();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("[WS] Invalid JSON:", err);
      }
    };
  }

  connect();

  return {
    close: () => {
      stopHeartbeat();
      if (socket) socket.close();
    },
  };
}

// --- HEARTBEAT SYSTEM (keeps connection alive) ---
function startHeartbeat() {
  stopHeartbeat();

  heartbeatInterval = setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "ping" }));
    }
  }, 15000); // every 15 seconds
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}


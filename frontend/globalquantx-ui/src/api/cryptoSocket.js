export function connectCryptoSocket(onMessage) {
  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/crypto-prices`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
}


export function connectWalletSocket(onMessage) {
  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/wallet`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return ws;
}

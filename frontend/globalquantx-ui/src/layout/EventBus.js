// Simple pub/sub event bus for global UI events
const listeners = {};

export function subscribe(event, handler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);

  return () => {
    listeners[event] = listeners[event].filter((h) => h !== handler);
  };
}

export function publish(event, payload) {
  if (!listeners[event]) return;
  listeners[event].forEach((handler) => handler(payload));
}


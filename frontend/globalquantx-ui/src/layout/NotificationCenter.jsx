import { useEffect, useState } from "react";
import { subscribe } from "./EventBus";

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { id: 1, text: "Rates shock applied (simulated)" },
    { id: 2, text: "Liquidity fracture flagged (simulated)" },
    { id: 3, text: "Momentum strategy stress elevated (simulated)" },
  ]);

  useEffect(() => {
    const unsubToggle = subscribe("notifications:toggle", () =>
      setOpen((o) => !o)
    );

    const unsubPush = subscribe("notifications:push", (payload) =>
      setItems((prev) => [{ id: Date.now(), text: payload }, ...prev])
    );

    return () => {
      unsubToggle();
      unsubPush();
    };
  }, []);

  if (!open) return null;

  return (
    <div className="nc-container">
      <h3>Notifications</h3>
      <ul>
        {items.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
    </div>
  );
}


// src/layout/DockablePanel.jsx
import React, { useState } from "react";
import { publish } from "./EventBus";

export default function DockablePanel({ id, title, children, path }) {
  const [docked, setDocked] = useState(true);

  const undock = () => {
    setDocked(false);
    publish("window:open", { path });
  };

  if (!docked) return null;

  return (
    <section className="dock-panel" data-id={id}>
      <header className="dock-header">
        <span>{title}</span>
        <div className="dock-actions">
          <button onClick={undock}>⇱</button>
        </div>
      </header>
      <div className="dock-body">{children}</div>
    </section>
  );
}


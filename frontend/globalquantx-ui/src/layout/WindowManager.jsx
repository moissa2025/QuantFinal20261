// src/layout/WindowManager.jsx
import React, { useEffect, useState } from "react";
import { subscribe } from "./EventBus";
import { NAV_INDEX, openRoute } from "./navigationIndex.js";

export default function WindowManager({ children }) {
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    const unsub = subscribe("window:open", ({ path }) => {
      const meta = NAV_INDEX.find((i) => i.path === path);
      setWindows((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          title: meta?.label || path,
          path,
          x: 260 + prev.length * 24,
          y: 140 + prev.length * 24,
        },
      ]);
    });
    return unsub;
  }, []);

  const closeWindow = (id) =>
    setWindows((prev) => prev.filter((w) => w.id !== id));

  return (
    <>
      <div className="os-content">{children}</div>

      {windows.map((win) => (
        <div
          key={win.id}
          className="floating-window"
          style={{ left: win.x, top: win.y }}
        >
          <div className="floating-header">
            <span>{win.title}</span>
            <div className="floating-actions">
              <button onClick={() => openRoute(win.path)}>⤢</button>
              <button onClick={() => closeWindow(win.id)}>×</button>
            </div>
          </div>
          <div className="floating-body">
            {/* For now, just show the path; later you can mount real components */}
            <div className="floating-placeholder">
              {win.title} ({win.path})
            </div>
          </div>
        </div>
      ))}
    </>
  );
}


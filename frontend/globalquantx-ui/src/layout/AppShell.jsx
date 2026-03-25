// src/layout/AppShell.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import CommandPalette from "./CommandPalette.jsx";
import { useAuth } from "../context/AuthContext";
import "./os-shell.css";

const THEMES = ["dark", "midnight", "terminal", "bloomberg"];

export default function AppShell({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const [lastKey, setLastKey] = useState(null);

  // Keyboard shortcuts: ⌘+K, g d, g m
  useEffect(() => {
    const handler = (e) => {
      // ⌘+K or Ctrl+K → command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
        return;
      }

      // Simple key chord: g then d / m
      const key = e.key.toLowerCase();
      if (lastKey === "g" && key === "d") {
        navigate("/adm/dash");
        setLastKey(null);
        return;
      }
      if (lastKey === "g" && key === "m") {
        navigate("/app/mkt");
        setLastKey(null);
        return;
      }
      setLastKey(key);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lastKey, navigate]);

  const themeClass = `theme-${theme}`;

  return (
    <div className={`app-shell ${themeClass}`}>
      <Sidebar />
      <div className="app-main">
        <header className="app-header">
          <div className="app-header-left">
            <div className="app-header-title">Control Plane</div>
            <div className="app-header-subtitle">
              Signed in as {user.name} ({user.role})
            </div>
          </div>
          <div className="app-header-right">
            <div className="app-header-theme">
              <span>Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="app-header-theme-select"
              >
                <option value="dark">Dark</option>
                <option value="midnight">Midnight</option>
                <option value="terminal">Terminal</option>
                <option value="bloomberg">Bloomberg-Black</option>
              </select>
            </div>
            <button
              className="app-header-icon"
              title="Notifications"
            >
              🔔
            </button>
            <button
              className="app-header-icon"
              title="Quick actions"
            >
              ⚡
            </button>
            <div className="app-header-user">
              <div className="app-header-avatar">
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>
            <span className="app-header-pill">CMD: ⌘K · g d · g m</span>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

// src/layout/CommandPalette.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS_FLAT } from "../config/navigationModel";
import "./os-shell.css";

const COMMANDS = [
  {
    id: "go-dashboard",
    patterns: [/^go dashboard$/, /^open dashboard$/, /^go to dashboard$/],
    action: (navigate) => navigate("/adm/dash"),
    label: "Go to Dashboard",
  },
  {
    id: "go-market",
    patterns: [/^go market$/, /^open market$/, /^go to market$/],
    action: (navigate) => navigate("/app/mkt"),
    label: "Go to Market",
  },
  {
    id: "go-portfolio",
    patterns: [/^go portfolio$/, /^open portfolio$/, /^go to portfolio$/],
    action: (navigate) => navigate("/app/pfl"),
    label: "Go to Portfolio",
  },
  {
    id: "go-liquidity-map",
    patterns: [
      /^go liquidity map$/,
      /^open liquidity map$/,
      /^go to liquidity map$/,
      /^show liquidity map$/,
    ],
    action: (navigate) => navigate("/adm/liq/map"),
    label: "Go to Liquidity Map",
  },
  {
    id: "help",
    patterns: [/^help$/, /^commands$/, /^what can i do\??$/],
    action: null, // handled as "help" mode
    label: "Show available commands",
  },
];

function matchCommand(raw) {
  const q = raw.trim().toLowerCase();
  if (!q) return null;

  for (const cmd of COMMANDS) {
    if (cmd.patterns.some((re) => re.test(q))) {
      return cmd;
    }
  }
  return null;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [lastExecuted, setLastExecuted] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setLastExecuted(null);
      return;
    }
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const matchedCommand = useMemo(() => matchCommand(query), [query]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS_FLAT;
    return NAV_ITEMS_FLAT.filter((item) => {
      return (
        item.label.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const handleSelectNav = (item) => {
    navigate(item.path);
    setLastExecuted({ type: "nav", label: item.label, path: item.path });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matchedCommand) {
      if (matchedCommand.action) {
        matchedCommand.action(navigate);
        setLastExecuted({ type: "cmd", label: matchedCommand.label });
        onClose();
      } else if (matchedCommand.id === "help") {
        setLastExecuted({
          type: "help",
          label: "Available commands",
        });
      }
      return;
    }

    // Fallback: if there is a top search result, go there
    if (searchResults.length > 0) {
      handleSelectNav(searchResults[0]);
    }
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay">
      <div className="cmd-panel">
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            className="cmd-input"
            placeholder="Type a command or search… (e.g. “go market”, “liquidity map”, “help”)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {matchedCommand && (
          <div className="cmd-empty" style={{ borderBottom: "1px solid #111827" }}>
            Interpreted as command: <strong>{matchedCommand.label}</strong>
          </div>
        )}

        {lastExecuted && lastExecuted.type === "help" && (
          <div className="cmd-results">
            {COMMANDS.filter((c) => c.id !== "help").map((cmd) => (
              <div key={cmd.id} className="cmd-item">
                <div className="cmd-item-main">
                  <span className="cmd-item-label">{cmd.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!lastExecuted || lastExecuted.type !== "help") && (
          <div className="cmd-results">
            {searchResults.length === 0 && (
              <div className="cmd-empty">No matches. Try another query.</div>
            )}
            {searchResults.map((item) => {
              const cmd = item.path.replace(/^\//, "");
              return (
                <button
                  key={item.id}
                  className="cmd-item"
                  onClick={() => handleSelectNav(item)}
                  type="button"
                >
                  <div className="cmd-item-main">
                    <span className="cmd-item-label">{item.label}</span>
                    <span className="cmd-item-section">
                      {item.sectionLabel}
                    </span>
                  </div>
                  <span className="cmd-item-short">{cmd}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="cmd-footer">
          <span>↩ Enter to run command / open top result</span>
          <span>Esc to close · ⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}


// src/layout/CommandPalette.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS_FLAT } from "../config/navigationModel";
import "./os-shell.css";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
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

  const results = useMemo(() => {
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

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay">
      <div className="cmd-panel">
        <input
          autoFocus
          className="cmd-input"
          placeholder="Search pages, symbols, analytics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="cmd-results">
          {results.length === 0 && (
            <div className="cmd-empty">No matches. Try another query.</div>
          )}
          {results.map((item) => {
            const cmd = item.path.replace(/^\//, "");
            return (
              <button
                key={item.id}
                className="cmd-item"
                onClick={() => handleSelect(item)}
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
        <div className="cmd-footer">
          <span>↩ Enter to navigate</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

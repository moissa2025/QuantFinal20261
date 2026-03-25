import { useEffect, useState } from "react";
import { subscribe } from "./EventBus";
import { NAV_INDEX, openRoute } from "./navigationIndex.js";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => subscribe("globalSearch:open", () => setOpen(true)), []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = NAV_INDEX.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const onSelect = (item) => {
    openRoute(item.path);
    setOpen(false);
    setQuery("");
  };

  if (!open) return null;

  return (
    <div className="gs-backdrop" onClick={() => setOpen(false)}>
      <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="gs-input"
          placeholder="Search modules, tools, pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="gs-list">
          {filtered.map((item) => (
            <button
              key={item.path}
              className="gs-item"
              onClick={() => onSelect(item)}
            >
              <span className="gs-icon">{item.icon}</span>
              <span>{item.label}</span>
              <span className="gs-meta">{item.category}</span>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="gs-empty">No matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
}


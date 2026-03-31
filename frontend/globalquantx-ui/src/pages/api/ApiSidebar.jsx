import React from "react";

export default function ApiSidebar({ endpoints, selected, onSelect }) {
  return (
    <aside className="gqx-api-sidebar">
      <h2>API Explorer</h2>
      <ul>
        {endpoints.map(ep => (
          <li
            key={ep.id}
            className={selected.id === ep.id ? "active" : ""}
            onClick={() => onSelect(ep)}
          >
            <span className="gqx-api-method">{ep.method}</span>
            <span className="gqx-api-path">{ep.path}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}


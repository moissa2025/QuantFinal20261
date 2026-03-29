// src/layout/Sidebar.jsx

import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { NAV_SECTIONS } from "../config/navigationModel";
import { hasPermission } from "../config/roles";
import { useAuth } from "../context/AuthContext";
import "./os-shell.css";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [openSections, setOpenSections] = useState(() =>
    NAV_SECTIONS.map((s) => s.id)
  );

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">GlobalQuantX</div>
        <div className="sidebar-subtitle">Institutional Multi-Asset Desk</div>
      </div>

      <div className="sidebar-sections">
        {NAV_SECTIONS.filter((section) =>
          hasPermission(user.role, section.permission)
        ).map((section) => {
          const isOpen = openSections.includes(section.id);
          return (
            <div key={section.id} className="sidebar-section">
              <button
                className="sidebar-section-header"
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.label}</span>
                <span className="sidebar-section-chevron">
                  {isOpen ? "▾" : "▸"}
                </span>
              </button>
              {isOpen && (
                <div className="sidebar-items">
                  {section.items.map((item) => {
                    const active = location.pathname === item.path;
                    const cmd = item.path.replace(/^\//, "");
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        title={`${item.label} (${cmd})`}
                        className={
                          "sidebar-item" +
                          (active ? " sidebar-item-active" : "")
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

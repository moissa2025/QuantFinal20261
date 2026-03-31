import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/navigation.css";

export default function Navigation() {
  return (
    <aside className="gqx-nav">
      <div className="gqx-logo">GlobalQuantX</div>

      <nav className="gqx-menu">
        <NavLink to="/app/dashboard">Dashboard</NavLink>
        <NavLink to="/app/trading">Trading Terminal</NavLink>
        <NavLink to="/app/positions">Positions & PnL</NavLink>
        <NavLink to="/app/ledger">Ledger</NavLink>
        <NavLink to="/app/risk">Risk</NavLink>
        <NavLink to="/app/market">Market Data</NavLink>
        <NavLink to="/app/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}


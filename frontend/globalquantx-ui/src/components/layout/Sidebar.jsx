import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="GlobalQuantX logo" />
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-text-title">GlobalQuantX</div>
          <div className="sidebar-logo-text-sub">INSTITUTIONAL ALGO DESK</div>
        </div>
      </div>

      <div>
        <div className="sidebar-section-title">Navigation</div>
        <div className="nav-list">
          <Link to="/" className="nav-item active">
            <span>
              <div className="nav-item-dot" />
              <div>Multi‑Asset Desk</div>
            </span>
            <span className="nav-item-badge">LIVE</span>
          </Link>

          <Link to="/dashboard" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Dashboard</div>
            </span>
          </Link>

          <Link to="/trading" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Trading Terminal</div>
            </span>
          </Link>

          <Link to="/positions" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Positions & PnL</div>
            </span>
          </Link>

          <Link to="/ledger" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Ledger</div>
            </span>
          </Link>

          <Link to="/risk" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Risk</div>
            </span>
          </Link>

          <Link to="/strategies" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Strategies</div>
            </span>
          </Link>

          <Link to="/market-data" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Market Data</div>
            </span>
          </Link>

          <Link to="/contact" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Contact</div>
            </span>
          </Link>

          <Link to="/about" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>About</div>
            </span>
          </Link>

          <Link to="/legal" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Legal</div>
            </span>
          </Link>

          <Link to="/privacy" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Privacy</div>
            </span>
          </Link>

          <Link to="/terms" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Terms</div>
            </span>
          </Link>

          <Link to="/support" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Support</div>
            </span>
          </Link>

          <Link to="/status" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>Status</div>
            </span>
          </Link>

          <Link to="/api-docs" className="nav-item">
            <span>
              <div className="nav-item-dot" />
              <div>API Docs</div>
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


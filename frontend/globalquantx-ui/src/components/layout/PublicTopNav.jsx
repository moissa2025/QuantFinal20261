import React from "react";
import { Link } from "react-router-dom";

const PublicTopNav = () => {
  return (
    <header className="public-topnav">
      <div className="public-topnav-left">
        <div className="public-logo-mark">GQX</div>
        <div className="public-logo-text">GlobalQuantX</div>
      </div>

      <nav className="public-topnav-center">
        <button className="public-nav-link">Markets</button>
        <button className="public-nav-link">Trade</button>
        <button className="public-nav-link">Earn</button>
        <button className="public-nav-link">Support</button>
      </nav>

      <div className="public-topnav-right">
        <Link to="/login" className="public-nav-auth-link">
          Log In
        </Link>
        <Link to="/register" className="public-nav-auth-cta">
          Register
        </Link>
      </div>
    </header>
  );
};

export default PublicTopNav;


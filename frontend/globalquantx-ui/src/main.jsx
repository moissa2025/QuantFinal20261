import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/layout.css";
import "./styles/landing.css";
import "./styles/dashboard.css";
import "./styles/trading.css";
import "./styles/portfolio.css";
import "./styles/market.css";
import "./styles/positions.css";
import "./styles/ledger.css";
import "./styles/settings.css";
import "./styles/admin.css";
import "./styles/support.css";
import "./styles/legal.css";
import "./styles/notifications.css";
import "./styles/audit.css";
import "./styles/api.css";
import "./styles/activity.css";
import "./styles/playground.css";
import "./styles/webhooks.css";
import "./styles/billing.css";
import "./styles/keys.css";
import "./styles/templates.css";
import "./styles/profile2.css";
import "./styles/export.css";
import "./styles/branding.css";
import "./styles/status.css";
import "./styles/impersonate.css";
import "./styles/tenant.css";
import "./styles/flags.css";




// GLOBAL STYLES
import "./styles/global.css";

// THEME INITIALIZATION
import { setTheme } from "./theme";

// AUTH CONTEXT PROVIDER
import AuthProvider from "./context/AuthContext";

// Apply theme BEFORE the app renders
setTheme("dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


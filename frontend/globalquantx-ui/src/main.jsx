import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// GLOBAL STYLES
import "./styles.css";

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


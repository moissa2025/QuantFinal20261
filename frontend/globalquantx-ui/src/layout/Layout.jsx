import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";

import Navigation from "./Navigation.jsx";
import Topbar from "./Topbar.jsx";

import WindowManager from "./WindowManager.jsx";
import CommandPalette from "./CommandPalette.jsx";
import NotificationCenter from "./NotificationCenter.jsx";
import KeyboardShortcuts from "./KeyboardShortcuts.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";

import "../styles/global.css";
import "./os-shell.css";

export default function Layout() {
  return (
    <ThemeProvider>
      <KeyboardShortcuts />
      <CommandPalette />
      <NotificationCenter />

      <div className="gqx-shell">
        <Navigation />

        <div className="gqx-main">
          <Topbar />

          <WindowManager>
            <Outlet />
          </WindowManager>
        </div>
      </div>

      <Footer />
    </ThemeProvider>
  );
}


import React from "react";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import BottomTickerBar from "./BottomTickerBar.jsx";
import Footer from "./Footer.jsx";

const AppShell = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <TopBar />
        {children}
      </main>
      <Footer />
      <BottomTickerBar />
    </div>
  );
};

export default AppShell;


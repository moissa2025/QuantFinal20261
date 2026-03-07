import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BottomTickerBar from "./BottomTickerBar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">

      {/* TOP NAVIGATION */}
      <TopBar />

      {/* MAIN BODY */}
      <div className="app-shell-body">
        <Sidebar />

        <main className="app-shell-main">
          {children}
        </main>
      </div>

      {/* FOOTER (optional) */}
      <Footer />

      {/* GLOBAL MARKET TICKER BAR */}
      <BottomTickerBar />
    </div>
  );
}


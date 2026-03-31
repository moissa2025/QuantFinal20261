import PublicHeader from "./PublicHeader.jsx";
import MarketTicker from "../components/MarketTicker.jsx";

export default function PublicShell({ children }) {
  return (
    <div className="gqx-public-shell">
      <PublicHeader />
      <MarketTicker />
      <main className="gqx-public-main">{children}</main>
      <Footer />
    </div>
  );
}


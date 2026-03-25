import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="nav-shell">

      {/* SIDEBAR */}
      <aside className="nav-sidebar">
        <h2 className="nav-title">Platform</h2>

        <nav className="nav-section">
          <h3>Core</h3>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/trading">Trading</Link>
          <Link to="/market">Market</Link>
        </nav>

        <nav className="nav-section">
          <h3>Macro</h3>
          <Link to="/global-macro">Global Macro</Link>
          <Link to="/regime-atlas">Regime Atlas</Link>
          <Link to="/macro-stress">Macro Stress</Link>
          <Link to="/macro-early-warning">Early Warning</Link>
        </nav>

        <nav className="nav-section">
          <h3>Strategies</h3>
          <Link to="/strategy-superlab">Strategy Super‑Lab</Link>
          <Link to="/alpha-map">Alpha Map</Link>
          <Link to="/alpha-decay">Alpha Decay</Link>
          <Link to="/strategy-stress">Stress Lab</Link>
          <Link to="/strategy-drift">Drift Analyzer</Link>
        </nav>

        <nav className="nav-section">
          <h3>Execution</h3>
          <Link to="/execution-superconsole">Execution Super‑Console</Link>
          <Link to="/execution-footprint">Footprint</Link>
          <Link to="/execution-replay">Replay</Link>
          <Link to="/execution-risk">Execution Risk</Link>
        </nav>

        <nav className="nav-section">
          <h3>Microstructure</h3>
          <Link to="/microstructure-replay">Micro Replay</Link>
          <Link to="/micro-regime">Micro Regime</Link>
          <Link to="/orderflow-lab">Order Flow Lab</Link>
        </nav>

        <nav className="nav-section">
          <h3>Vol & Liquidity</h3>
          <Link to="/liqvol-observatory">Liq‑Vol Observatory</Link>
          <Link to="/vol-surface-regime">Vol Surface</Link>
          <Link to="/vol-interaction">Vol Interaction</Link>
          <Link to="/liquidity-fracture">Liquidity Fracture</Link>
          <Link to="/liquidity-map">Liquidity Map</Link>
        </nav>

        <nav className="nav-section">
          <h3>Fusion</h3>
          <Link to="/global-command-center">Command Center</Link>
          <Link to="/macro-micro-fusion">Fusion Board</Link>
          <Link to="/market-state-machine">State Machine</Link>
          <Link to="/market-intelligence">Intelligence Hub</Link>
        </nav>

        <nav className="nav-section">
          <h3>Admin</h3>
          <Link to="/settings">Settings</Link>
          <Link to="/support">Support</Link>
          <Link to="/legal">Legal</Link>
          <Link to="/audit">Audit</Link>
          <Link to="/billing">Billing</Link>
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="nav-content">
        <Outlet />
      </main>

    </div>
  );
}


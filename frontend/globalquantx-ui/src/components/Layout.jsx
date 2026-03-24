export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="logo">GlobalQuantX</div>

        <nav className="menu">
          <a href="/app/dashboard">Dashboard</a>
          <a href="/app/portfolio">Portfolio</a>
          <a href="/app/trading">Trading</a>
          <a href="/app/market">Market</a>
          <a href="/app/positions">Positions</a>
          <a href="/app/ledger">Ledger</a>
          <a href="/app/settings">Settings</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">GlobalQuantX Platform</div>
          <div className="topbar-user">Mo</div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}


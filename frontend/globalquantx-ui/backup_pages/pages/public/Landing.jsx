import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Landing() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="landing-logo">GlobalQuantX</div>
        <nav className="landing-nav">
          <a href="/login">Login</a>
          <a href="/support">Support</a>
          <a href="/legal/terms">Terms</a>
        </nav>
      </header>

      <main className="landing-hero">
        <h1 className="landing-title">
          Institutional‑Grade Trading Infrastructure
        </h1>

        <p className="landing-subtitle">
          Built for performance, precision, and regulatory‑aligned execution.
        </p>

        <a className="landing-cta" href="/login">
          Enter Platform
        </a>
      </main>

      <footer className="landing-footer">
        © {new Date().getFullYear()} GlobalQuantX — All Rights Reserved
      </footer>

</DockablePanel>
  );
}


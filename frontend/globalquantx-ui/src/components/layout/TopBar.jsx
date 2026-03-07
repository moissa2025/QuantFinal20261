import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-title">GLOBALQUANTX MULTI‑ASSET DESK</div>
        <div className="top-bar-sub">
          Real‑time view across crypto, FX, equities, and ETFs – wired for algorithmic execution.
        </div>
      </div>

      <div className="top-bar-right">
        {/* Latency Pill */}
        <div className="pill">
          <div className="pill-dot" />
          <span>Core routing engine: &lt; 5 ms internal latency</span>
        </div>

        {/* User Chip */}
        <div className="user-chip">
          <div className="user-avatar" />

          <div>
            <div style={{ fontSize: 11 }}>
              {user?.email || "Guest session"}
            </div>

            <div style={{ fontSize: 10, color: "var(--muted)" }}>
              {user ? "Authenticated" : "Create an account to onboard"}
            </div>
          </div>
        </div>

        {/* Logout Button (only if logged in) */}
        {user && (
          <button
            className="logout-btn"
            onClick={logout}
            style={{
              marginLeft: "12px",
              padding: "6px 10px",
              fontSize: "12px",
              borderRadius: "6px",
              background: "var(--danger)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}


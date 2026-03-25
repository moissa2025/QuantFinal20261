import { useLocation } from "react-router-dom";
import { NAV_INDEX } from "./navigationIndex.js";
import { useTheme } from "./ThemeContext";
import { publish } from "./EventBus";

const findByPath = (path) => NAV_INDEX.find((i) => i.path === path);

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const current = findByPath(location.pathname);

  return (
    <header className="nav-topbar">
      <div className="nav-topbar-left">
        <span className="nav-topbar-title">
          {current ? current.label : "Control Plane"}
        </span>
      </div>

      <div className="nav-topbar-right">
        <button
          className="nav-topbar-btn"
          onClick={() => publish("commandPalette:open")}
        >
          ⌘K
        </button>

        <button
          className="nav-topbar-btn"
          onClick={() => publish("notifications:toggle")}
        >
          Notifications
        </button>

        <button className="nav-topbar-btn" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}


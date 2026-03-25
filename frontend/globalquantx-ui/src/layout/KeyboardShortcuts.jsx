import { useEffect } from "react";
import { publish } from "./EventBus";

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;

      // Command Palette
      if (meta && key === "k") {
        e.preventDefault();
        publish("commandPalette:open");
      }

      // Global Search
      if (meta && key === "f") {
        e.preventDefault();
        publish("globalSearch:open");
      }

      // Notifications
      if (meta && key === "n") {
        e.preventDefault();
        publish("notifications:toggle");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}


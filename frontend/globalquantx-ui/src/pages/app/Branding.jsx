import { useState } from "react";

export default function Branding() {
  const [primaryColor, setPrimaryColor] = useState("#0070f3");
  const [accentColor, setAccentColor] = useState("#00c853");
  const [radius, setRadius] = useState(6);
  const [font, setFont] = useState("Inter");

  return (
    <div className="branding-container">

      {/* HEADER */}
      <div className="branding-header">
        <h1>Branding & Theme Manager</h1>
        <p>Customize the platform’s appearance, colors, typography, and layout.</p>
      </div>

      {/* COLORS */}
      <div className="branding-panel">
        <h2>Colors</h2>

        <div className="branding-row">
          <div className="branding-item">
            <label>Primary Color</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
            <span className="color-value">{primaryColor}</span>
          </div>

          <div className="branding-item">
            <label>Accent Color</label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
            <span className="color-value">{accentColor}</span>
          </div>
        </div>
      </div>

      {/* TYPOGRAPHY */}
      <div className="branding-panel">
        <h2>Typography</h2>

        <div className="branding-item">
          <label>Font Family</label>
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option>Inter</option>
            <option>Roboto</option>
            <option>SF Pro</option>
            <option>Open Sans</option>
            <option>Montserrat</option>
          </select>
        </div>
      </div>

      {/* RADIUS */}
      <div className="branding-panel">
        <h2>Border Radius</h2>

        <div className="branding-item">
          <label>Corner Radius (px)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
          <span className="radius-value">{radius}px</span>
        </div>
      </div>

      {/* LOGO */}
      <div className="branding-panel">
        <h2>Logo</h2>

        <div className="branding-item">
          <label>Upload Logo</label>
          <div className="branding-upload">Drop file here (UI only)</div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="branding-panel">
        <h2>Live Preview</h2>

        <div
          className="branding-preview"
          style={{
            borderRadius: `${radius}px`,
            borderColor: primaryColor
          }}
        >
          <h3 style={{ color: primaryColor, fontFamily: font }}>
            GlobalQuantX
          </h3>
          <p style={{ color: accentColor, fontFamily: font }}>
            Institutional Trading Platform
          </p>
        </div>
      </div>

      {/* HISTORY */}
      <div className="branding-panel">
        <h2>Theme History</h2>

        <ul className="branding-history">
          <li>2026‑03‑23 — Updated primary color</li>
          <li>2026‑03‑20 — Changed font to Inter</li>
          <li>2026‑03‑18 — Initial theme created</li>
        </ul>
      </div>

    </div>
  );
}


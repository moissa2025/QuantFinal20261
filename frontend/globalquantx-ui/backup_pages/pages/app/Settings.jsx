import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Settings() {
  return (
    <div className="settings-container">

      {/* PROFILE SECTION */}
      <div className="settings-panel">
        <h3>Profile</h3>

        <div className="settings-row">
          <label>Full Name</label>
          <input type="text" value="Mohamed Issa" readOnly />


        <div className="settings-row">
          <label>Email</label>
          <input type="text" value="mohamed@example.com" readOnly />


        <div className="settings-row">
          <label>Role</label>
          <input type="text" value="Trader" readOnly />



      {/* SECURITY SECTION */}
      <div className="settings-panel">
        <h3>Security</h3>

        <div className="settings-row">
          <label>Password</label>
          <button className="settings-button">Change Password</button>


        <div className="settings-row">
          <label>Two‑Factor Authentication</label>
          <button className="settings-button">Enable 2FA</button>



      {/* API KEYS */}
      <div className="settings-panel">
        <h3>API Keys</h3>

        <div className="settings-row">
          <label>Public Key</label>
          <input type="text" value="pk_live_123456789" readOnly />


        <div className="settings-row">
          <label>Secret Key</label>
          <input type="password" value="••••••••••••••••" readOnly />


        <button className="settings-button danger">Regenerate Keys</button>


      {/* PREFERENCES */}
      <div className="settings-panel">
        <h3>Preferences</h3>

        <div className="settings-row">
          <label>Theme</label>
          <select>
            <option>Dark</option>
            <option>Light</option>
          </select>


        <div className="settings-row">
          <label>Notifications</label>
          <select>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>




</DockablePanel>
  );
}


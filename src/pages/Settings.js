// Settings.js
import React, { useState } from "react";
import {
  FaUser,
  FaBell,
  FaLock,
  FaPalette,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
// Removed unused imports: FaGlobe and FaEnvelope
import "../css/Settings.css";
import { useSelector } from "react-redux";

const Settings = () => {
  const user = useSelector((state) => state.globals.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-grid">
        {/* Account Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaUser className="card-icon" />
            <h2>Account Settings</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={name}
                onChange={setName}
                type="text"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={phoneNumber}
                onChange={setPhoneNumber}
                type="tel"
                placeholder="Enter phone number"
              />
            </div>
            <button className="save-btn">Save Changes</button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaBell className="card-icon" />
            <h2>Notifications</h2>
          </div>
          <div className="card-content">
            <div className="toggle-group">
              <div className="toggle-label">
                <span>Push Notifications</span>
                <p>Receive notifications about your services</p>
              </div>
              <button
                className={`toggle-btn ${notificationsEnabled ? "active" : ""}`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                {notificationsEnabled ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
            <div className="toggle-group">
              <div className="toggle-label">
                <span>Email Updates</span>
                <p>Receive updates via email</p>
              </div>
              <button
                className={`toggle-btn ${emailUpdates ? "active" : ""}`}
                onClick={() => setEmailUpdates(!emailUpdates)}
              >
                {emailUpdates ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaLock className="card-icon" />
            <h2>Security</h2>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="save-btn">Update Password</button>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-card">
          <div className="card-header">
            <FaPalette className="card-icon" />
            <h2>Appearance</h2>
          </div>
          <div className="card-content">
            <div className="toggle-group">
              <div className="toggle-label">
                <span>Dark Mode</span>
                <p>Switch between light and dark theme</p>
              </div>
              <button
                className={`toggle-btn ${darkMode ? "active" : ""}`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <FaToggleOn /> : <FaToggleOff />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

// Settings.js
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { specificLoadingProcess, update } from "../firebase/helper";
import { setSpecificLoading, setUser } from "../state/globalsSlice";
import Spinner from "../components/Spinner";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

const Settings = () => {
  const user = useSelector((state) => state.globals.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isLoading = useSelector((state) => state.globals.specificLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSpecificLoading(false));
  }, []);

  const handleChangePassword = () => {
    if (isLoading) return;

    if (newPassword.trim() == ""){
      alert("Please fill the password!!!")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    specificLoadingProcess(
      async () => {
        const _user = auth.currentUser;

        const credential = EmailAuthProvider.credential(
          _user.email,
          currentPassword
        );
        await reauthenticateWithCredential(_user, credential);
        await updatePassword(_user, newPassword);
        console.log("✅ Password updated successfully!");
        alert("Your password has been changed.");
      },
      (error) => {
        if (error.message == "Firebase: Error (auth/invalid-credential).") {
          alert("Invalid current password.");
          return;
        }
        alert(error.message);
      }
    );
  };

  const updateProfile = () => {
    if (isLoading) return;

    if (!name?.trim() || !phoneNumber?.trim()) {
      alert("Please fill all fields to continue!!!");
      return;
    }

    specificLoadingProcess(async () => {
      await update("users", user.id, {
        name: name,
        phoneNumber: phoneNumber,
      });

      dispatch(
        setUser({
          ...user,
          name: name,
          phoneNumber: phoneNumber,
        })
      );

      alert("Successfully updated profile.");
    });
  };

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
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter name"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                disabled
                // onChange={setEmail}
                type="email"
                placeholder="Enter email"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="tel"
                placeholder="Enter phone number"
              />
            </div>
            {isLoading ? (
              <Spinner size="30px" />
            ) : (
              <button onClick={updateProfile} className="save-btn">
                Save Changes
              </button>
            )}
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
              <input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <button onClick={handleChangePassword} className="save-btn">
              Update Password
            </button>
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

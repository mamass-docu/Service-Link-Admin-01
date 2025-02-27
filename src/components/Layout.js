import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTools,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaUsers,
  FaComments,
  FaMoneyBillWave, // Added for Transactions
} from "react-icons/fa";
import "../css/Layout.css";
import { loadingProcess, serverTimestamp, update } from "../firebase/helper";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase/firebase";
import { setUser } from "../state/globalsSlice";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.globals.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    loadingProcess(async () => {
      await update("users", user.id, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });

      await auth.signOut();

      dispatch(setUser(null));

      localStorage.removeItem("userToken");
      navigate("/", { replace: true });
    });
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin/home":
        return "Dashboard";
      case "/admin/services":
        return "Services";
      case "/admin/reports":
        return "Reports";
      case "/admin/verification":
        return "Verification";
      case "/admin/users":
        return "Manage Users";
      case "/admin/messages":
        return "Messages";
      case "/admin/transactions":
        return "Transactions"; // New case added
      case "/admin/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>ServicePro</h2>
          <button className="close-btn">×</button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin/home"
            className={`nav-item ${
              location.pathname === "/admin/home" ? "active" : ""
            }`}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/services"
            className={`nav-item ${
              location.pathname === "/admin/services" ? "active" : ""
            }`}
          >
            <FaTools /> <span>Services</span>
          </Link>
          {/* <Link
            to="/admin/reports"
            className={`nav-item ${
              location.pathname === "/admin/reports" ? "active" : ""
            }`}
          >
            <FaChartBar /> <span>Reports</span>
          </Link> */}
          <Link
            to="/admin/verification"
            className={`nav-item ${
              location.pathname === "/admin/verification" ? "active" : ""
            }`}
          >
            <FaShieldAlt /> <span>Verification</span>
          </Link>
          <Link
            to="/admin/users"
            className={`nav-item ${
              location.pathname === "/admin/users" ? "active" : ""
            }`}
          >
            <FaUsers /> <span>Manage Users</span>
          </Link>
          <Link
            to="/admin/messages"
            className={`nav-item ${
              location.pathname === "/admin/messages" ? "active" : ""
            }`}
          >
            <FaComments /> <span>Messages</span>
          </Link>
          <Link
            to="/admin/transactions"
            className={`nav-item ${
              location.pathname === "/admin/transactions" ? "active" : ""
            }`}
          >
            <FaMoneyBillWave /> <span>Transactions</span> {/* New link added */}
          </Link>
          <Link
            to="/admin/settings"
            className={`nav-item ${
              location.pathname === "/admin/settings" ? "active" : ""
            }`}
          >
            <FaCog /> <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="top-header">
          <h1>{getPageTitle()}</h1>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="profile-image">
              <div className="profile-text">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {/* <img
                src="https://assets.epuzzle.info/puzzle/158/484/original.jpg"
                alt="John Doe"
                className="profile-pic"
              /> */}
            </div>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

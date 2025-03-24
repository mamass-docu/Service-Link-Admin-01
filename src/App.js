// App.js with authentication protection
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Verification from "./pages/Verification";
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import Transactions from "./pages/Transactions";
import "./App.css";
import { useSelector } from "react-redux";
import ReportedUsers from "./pages/ReportedUsers";
import UpdateGCash from "./pages/UpdateGCash";
import BillHistory from "./pages/BillHistory";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.globals.user);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/home" replace />} />
        <Route path="home" element={<Reports />} />
        <Route path="services" element={<Services />} />
        {/* <Route path="reports" element={<Reports />} /> */}
        <Route path="verification" element={<Verification />} />
        <Route path="users" element={<Users />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="reported-users" element={<ReportedUsers />} />
        <Route path="update-gcash" element={<UpdateGCash />} />
        <Route path="bill-history" element={<BillHistory />} />
      </Route>

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

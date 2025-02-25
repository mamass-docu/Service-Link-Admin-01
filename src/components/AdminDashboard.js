import React from 'react';
import { Link } from 'react-router-dom';
import AddServiceForm from './AddServiceForm';
import '../css/AdminDashboard.css'; // Import the CSS file for styling

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Efficiently manage your services</p>
      </header>
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/admin/home">Home</Link></li>
          <li><Link to="/admin/services">Services</Link></li>
          <li><Link to="/admin/reports">Reports</Link></li>
          <li><Link to="/admin/settings">Settings</Link></li>
        </ul>
      </nav>
      <main className="form-container">
        <AddServiceForm />
      </main>
    </div>
  );
};

export default AdminDashboard;

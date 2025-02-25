// pages/Users.js
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
} from "react-icons/fa";
import "../css/Users.css";
import { FaBan } from "react-icons/fa";
import { all, loadingProcess } from "../firebase/helper";
import { useSelector } from "react-redux";
import { timestampToStringConverter } from "../helpers/TimestampToStringConverter";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("All");
  const [users, setUsers] = useState([
    // {
    //   id: 1,
    //   name: "John Smith",
    //   email: "john.smith@example.com",
    //   phone: "+1 234-567-8900",
    //   type: "admin",
    //   status: "active",
    //   joinDate: "2024-01-15",
    //   lastLogin: "2024-01-28"
    // },
    // {
    //   id: 2,
    //   name: "Sarah Johnson",
    //   email: "sarah.j@example.com",
    //   phone: "+1 234-567-8901",
    //   type: "provider",
    //   status: "active",
    //   joinDate: "2024-01-10",
    //   lastLogin: "2024-01-27"
    // },
    // Add more users as needed
  ]);

  const userId = useSelector((state) => state.globals.user.id);

  useEffect(() => {
    loadingProcess(async () => {
      const snap = await all("users");
      let temp = [];
      snap.docs.forEach((doc) => {
        if (doc.id == userId) return;

        const data = doc.data();
        temp.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          role: data.role,
          email: data.email,
          phoneNumber: data.phoneNumber,
          createdAt: timestampToStringConverter(data.createdAt),
          lastSeen: timestampToStringConverter(data.lastSeen),
        });
      });
      setUsers(temp);
    });
  }, []);

  const handleAddUser = () => {
    // Implement add user functionality
    console.log("Add user clicked");
  };

  const handleEditUser = (id) => {
    // Implement edit user functionality
    console.log("Edit user:", id);
  };

  const handleDeleteUser = (id) => {
    // Implement delete user functionality
    console.log("Delete user:", id);
  };

  const filteredUsers =
    searchTerm.trim() == "" && userType == "All"
      ? users
      : users.filter((user) => {
          const search = searchTerm.trim().toLowerCase();
          let add = true;
          if (search != "") {
            if (
              !user.name.toLowerCase().includes(search) &&
              !user.email.toLowerCase().includes(search)
            )
              return false;
          }
          if (userType != "All") {
            if (userType != user.role) return false;
          }
          return true;
        });

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="header-left">
          <h2>User Management</h2>
          <p>Manage system users and their roles</p>
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      <div className="users-controls">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="user-type-filter"
        >
          <option value="All">All Users</option>
          <option value="Admin">Administrators</option>
          <option value="Provider">Service Providers</option>
          <option value="Customer">Customers</option>
        </select>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                <FaUserCircle />
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <span className={`user-type ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <FaPhone className="detail-icon" />
                <span>{user.phoneNumber}</span>
              </div>
            </div>

            <div className="user-meta">
              <div className="meta-item">
                <label>Joined</label>
                <span>{user.createdAt}</span>
              </div>
              <div className="meta-item">
                <label>Last Login</label>
                <span>{user.lastSeen}</span>
              </div>
            </div>

            <div className="user-actions">
              <button
                className="edit-btn"
                onClick={() => handleEditUser(user.id)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleEditUser(user.id)}
              >
                <FaBan />
                Ban User
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteUser(user.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;

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
import { addNotif, all, loadingProcess, update } from "../firebase/helper";
import { useSelector } from "react-redux";
import { timestampToStringConverter } from "../helpers/TimestampToStringConverter";

const Modal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{message}</h2>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("All");
  const [idToDelete, setIDToDelete] = useState(null);
  const [banData, setBanData] = useState(null);
  const [users, setUsers] = useState([]);

  const userId = useSelector((state) => state.globals.user.id);

  useEffect(() => {
    loadingProcess(async () => {
      const snap = await all("users");
      let temp = [];
      snap.docs.forEach((doc) => {
        if (doc.id == userId) return;

        const data = doc.data();
        if (!data.active) return;

        temp.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          role: data.role,
          email: data.email,
          banned: data.banned,
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

  const handleDeleteUser = async () => {
    await update("users", idToDelete, {
      active: false,
    });
    addNotif(idToDelete, "deleted", "", "Login", null);
    setUsers((prev) => prev.filter((b) => b.id == idToDelete));
    setIDToDelete(null);
    alert("Successfully deleted a user.")
  };

  const handleBanUser = async () => {
    await update("users", banData.id, {
      banned: banData.banned,
    });
    if (banData.banned) addNotif(banData.id, "banned", "", "Login", null);
    setUsers((prev) =>
      prev.map((b) =>
        b.id == banData.id ? { ...b, banned: banData.banned } : b
      )
    );
    setBanData(null);
    alert(`Succesfully ${banData.banned ? "" : "un"}banned a user.`)
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
        {/* <button className="add-user-btn" onClick={handleAddUser}>
          <FaUserPlus /> Add New User
        </button> */}
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
              {/* <button
                className="edit-btn"
                onClick={() => handleEditUser(user.id)}
              >
                <FaEdit /> Edit
              </button> */}
              <button
                className="delete-btn"
                onClick={() =>
                  setBanData({
                    id: user.id,
                    banned: user.banned ? false : true,
                  })
                }
              >
                <FaBan />
                {user.banned ? "Unban" : "Ban"} User
              </button>
              <button
                className="delete-btn"
                onClick={() => setIDToDelete(user.id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        message={`Are you sure you want to ${
          banData?.banned ? "" : "un"
        }ban this user?`}
        show={banData}
        onConfirm={handleBanUser}
        onCancel={() => setBanData(null)}
      />

      <Modal
        message={"Are you sure you want to delete this user?"}
        show={idToDelete}
        onConfirm={handleDeleteUser}
        onCancel={() => setIDToDelete(false)}
      />
    </div>
  );
};

export default Users;

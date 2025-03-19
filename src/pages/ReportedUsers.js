import React, { useEffect, useState } from "react"; // Ensure useState is imported

import {
  FaExclamationTriangle,
  FaEye,
  FaBan,
  FaEnvelope,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCheck, // Add this import for FaCheck
} from "react-icons/fa";
import "../css/ReportedUsers.css";
import { all, loadingProcess, update } from "../firebase/helper";
import { Link } from "react-router-dom";

const DATA_PER_PAGE = 5;

const ReportedUsers = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadingProcess(async () => {
      const snap = await all("reportedUsers");
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllData(data);
      setFilteredData(data);
      if (data.length <= DATA_PER_PAGE) return;

      setPagesNumbers(data.length);
    });
  }, []);

  useEffect(() => {
    setReportedUsers(
      filteredData.slice(DATA_PER_PAGE * (page - 1), DATA_PER_PAGE * page)
    );
  }, [page, filteredData]);

  useEffect(() => {
    if (allData.length == 0) return;

    let filtered = allData;
    const search = searchTerm.trim();
    if (search != "")
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.reportedByName.toLowerCase().includes(search)
      );
    if (statusFilter != "All")
      filtered = filtered.filter((item) => item.status == statusFilter);
    setFilteredData(filtered);
    setPage(1);
    setPagesNumbers(filtered.length);
  }, [statusFilter, searchTerm]);

  const setPagesNumbers = (dataLength) => {
    let size = parseInt(dataLength / DATA_PER_PAGE);

    if (dataLength % DATA_PER_PAGE != 0) size++;
    // let t = [1];
    // for (let i = 2; i <= size; i++) t.push(i);
    setPages(size);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleStatusChange = (id, newStatus) => {
    update("reportedUsers", id, { status: newStatus });
    setFilteredData((prev) =>
      prev.map((v) => (v.id == id ? { ...v, status: newStatus } : v))
    );
    if (selectedUser)
      setSelectedUser((prev) => ({ ...prev, status: newStatus }));
  };

  const onBan = (id) => {
    update("users", id, { banned: true });
    handleStatusChange(id, "Banned");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-badge pending";
      case "Reviewing":
        return "status-badge reviewing";
      case "Resolved":
        return "status-badge resolved";
      case "Banned":
        return "status-badge banned";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="reported-users-container">
      <div className="reported-users-header">
        <h2>
          <FaExclamationTriangle className="header-icon" /> Reported Service
          Providers
        </h2>
        <div className="filter-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Reviewing">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Banned">Banned</option>
          </select>
        </div>
      </div>

      {reportedUsers.length === 0 ? (
        <div className="no-results">
          <FaExclamationTriangle size={48} />
          <p>No reported users match your search criteria.</p>
        </div>
      ) : (
        <div className="reported-users-cards">
          {reportedUsers.map((user) => (
            <div className="user-report-card" key={user.id}>
              <div className="user-report-info">
                <img src={user.image} alt={user.name} className="user-avatar" />
                <div className="user-details">
                  <h3>{user.name}</h3>
                  {/* <p className="user-id">{user.id}</p> */}
                  <p className="user-service">{user.role}</p>
                  <div className={getStatusBadgeClass(user.status)}>
                    {user.status === "Pending" && "Pending Review"}
                    {user.status === "Reviewing" && "Under Review"}
                    {user.status === "Resolved" && "Resolved"}
                    {user.status === "Banned" && "Account Banned"}
                  </div>
                </div>
              </div>
              <div className="report-details">
                <p>
                  <strong>Reported by:</strong> {user.reportedByName}
                </p>
                <p>
                  <strong>Reason:</strong> {user.reason}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(user.at.toDate()).toLocaleDateString()}
                </p>
              </div>
              <div className="report-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => setSelectedUser(user)}
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          <FaChevronLeft /> Previous
        </button>
        <div className="page-indicator">
          Page {page} of {pages}
        </div>
        <button
          className="pagination-btn"
          disabled={page === pages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next <FaChevronRight />
        </button>
      </div>

      {selectedUser && (
        <div className="detail-modal-overlay">
          <div className="detail-modal">
            <div className="modal-header">
              <h3>Report Details</h3>
              <button className="close-modal" onClick={handleCloseDetails}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="provider-profile">
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="provider-avatar"
                />
                <div className="provider-info">
                  <h4>{selectedUser.name}</h4>
                  {/* <p className="provider-id">{selectedUser.id}</p> */}
                  <p className="provider-service">{selectedUser.role}</p>
                  <div className={getStatusBadgeClass(selectedUser.status)}>
                    {selectedUser.status === "Pending" && "Pending Review"}
                    {selectedUser.status === "Reviewing" && "Under Review"}
                    {selectedUser.status === "Resolved" && "Resolved"}
                    {selectedUser.status === "Banned" && "Account Banned"}
                  </div>
                </div>
              </div>

              <div className="report-full-details">
                <div className="detail-section">
                  <h5>Report Information</h5>
                  <p>
                    <strong>Reported by:</strong> {selectedUser.reportedByName}
                  </p>
                  <p>
                    <strong>Date Reported:</strong>{" "}
                    {new Date(selectedUser.at.toDate()).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Reason:</strong> {selectedUser.reason}
                  </p>
                </div>

                <div className="detail-section">
                  <h5>Detailed Description</h5>
                  <p>{selectedUser.description}</p>
                </div>

                <div className="detail-section">
                  <h5>Actions</h5>
                  <div className="action-buttons">
                    {selectedUser.status !== "Reviewing" && (
                      <button
                        className="modal-action-btn review-btn"
                        onClick={() =>
                          handleStatusChange(selectedUser.id, "Reviewing")
                        }
                      >
                        <FaEye /> Mark as Under Review
                      </button>
                    )}

                    {selectedUser.status !== "Resolved" && (
                      <button
                        className="modal-action-btn resolve-btn"
                        onClick={() =>
                          handleStatusChange(selectedUser.id, "Resolved")
                        }
                      >
                        <FaCheck /> Mark as Resolved
                      </button>
                    )}

                    {selectedUser.status !== "Banned" && (
                      <button
                        className="modal-action-btn ban-btn"
                        onClick={() => onBan(selectedUser.id)}
                      >
                        <FaBan /> Ban Account
                      </button>
                    )}

                    {selectedUser.role == "Provider" ? (
                      <Link
                        to={`/admin/messages?userId=${selectedUser.id}`}
                        className="modal-action-btn message-btn"
                      >
                        <FaEnvelope /> Message Provider
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedUsers;

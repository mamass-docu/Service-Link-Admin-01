// Verification.js
import React, { useState } from 'react';
import { 
  FaCheck, 
  FaTimes, 
  FaSearch,
  FaUserTie,
  FaBuilding,
  FaToolbox,
  FaEnvelope,
  FaPhone,
  FaFileAlt
} from 'react-icons/fa';
import '../css/Verification.css';

const Verification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  const [verifications, setVerifications] = useState([
    {
      id: 1,
      providerName: "John Smith",
      businessName: "Smith's Professional Cleaning",
      serviceType: "House Cleaning",
      submissionDate: "2024-01-28",
      documents: ["Business Permit", "Government ID", "Insurance Certificate"],
      status: "pending",
      email: "john.smith@email.com",
      phone: "+1 234-567-8900",
      experience: "5 years",
      rating: 4.8
    },
    // Add more verifications as needed
  ]);

  const handleApprove = (id) => {
    setVerifications(prevVerifications =>
      prevVerifications.map(verification =>
        verification.id === id ? { ...verification, status: 'approved' } : verification
      )
    );
  };

  const handleReject = (id) => {
    setVerifications(prevVerifications =>
      prevVerifications.map(verification =>
        verification.id === id ? { ...verification, status: 'rejected' } : verification
      )
    );
  };

  return (
    <div className="verification-container">
      <div className="verification-header">
        <div className="header-title">
          <h2>Service Provider Verifications</h2>
          <p>Review and manage service provider applications</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="verifications-grid">
        {verifications.map(verification => (
          <div key={verification.id} className={`verification-card ${verification.status}`}>
            <div className="card-header">
              <div className="provider-info">
                <FaUserTie className="provider-icon" />
                <div>
                  <h3>{verification.providerName}</h3>
                  <span className="experience">{verification.experience} Experience</span>
                </div>
              </div>
              <span className={`status-badge ${verification.status}`}>
                {verification.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-row">
                <div className="info-item">
                  <FaBuilding className="info-icon" />
                  <div>
                    <label>Business</label>
                    <p>{verification.businessName}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaToolbox className="info-icon" />
                  <div>
                    <label>Service</label>
                    <p>{verification.serviceType}</p>
                  </div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <label>Email</label>
                    <p>{verification.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <label>Phone</label>
                    <p>{verification.phone}</p>
                  </div>
                </div>
              </div>

              <div className="documents-section">
                <label>
                  <FaFileAlt /> Submitted Documents
                </label>
                <div className="document-list">
                  {verification.documents.map((doc, index) => (
                    <span key={index} className="document-tag">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {verification.status === 'pending' && (
              <div className="card-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(verification.id)}
                >
                  <FaCheck /> Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(verification.id)}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Verification;

// Verification.js
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaSearch,
  FaUserTie,
  FaBuilding,
  FaToolbox,
  FaEnvelope,
  FaPhone,
  FaFileAlt,
} from "react-icons/fa";
import "../css/Verification.css";
import { all, find, loadingProcess, update } from "../firebase/helper";
import { timestampToStringConverter } from "../helpers/TimestampToStringConverter";

const Verification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  const [verifications, setVerifications] = useState([]);
  const [filteredVerifications, setFilteredVerifications] = useState([]);

  useEffect(() => {
    loadingProcess(refresh);
  }, []);

  const refresh = async () => {
    const snap = await all("toVerifyProviders");
    let temp = [];
    for (let i in snap.docs) {
      const doc = snap.docs[i];
      const data = doc.data();
      const docuSnap = await find("providerDocuments", doc.id);

      const val = {
        id: doc.id,
        ...data,
        documents: docuSnap.data(),
        sentAt: timestampToStringConverter(data.sentAt),
      };
      temp.push(val);
    }
    setVerifications(temp);

    // setVerifications(
    //   snap.docs.map(async (doc) => {
    //     const data = doc.data();
    //     const docuSnap = await find("providerDocuments", doc.id);
    //     const val = {
    //       id: doc.id,
    //       ...data,
    //       documents: docuSnap.data(),
    //       sentAt: timestampToStringConverter(data.sentAt),
    //     };
    //     if (data.status == "Pending") temp.push(val);
    //     return val;
    //   })
    // );
  };

  useEffect(() => {
    const search = searchTerm.trim().toLowerCase();
    setFilteredVerifications(
      filterStatus == "All" && search == ""
        ? verifications
        : verifications.filter((item) => {
            if (
              search != "" &&
              !item.name.toLowerCase().includes(search) &&
              !item.email.toLowerCase().includes(search)
            )
              return false;
            if (filterStatus != "All" && item.status != filterStatus)
              return false;
            return true;
          })
    );
  }, [filterStatus, searchTerm, verifications]);

  const handleApprove = (id) => {
    loadingProcess(async () => {
      await update("toVerifyProviders", id, {
        status: "Approved",
      });
      await update("users", id, {
        verified: true,
      });
      await refresh();
    });
  };

  const handleReject = (id) => {
    loadingProcess(async () => {
      await update("toVerifyProviders", id, {
        status: "Rejected",
      });
      await update("users", id, {
        verified: false,
      });
      await refresh();
    });
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
            <option value="All">All Applications</option>
            <option value="Pending">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="verifications-grid">
        {filteredVerifications.map((verification) => (
          <div
            key={verification.id}
            className={`verification-card ${verification.status}`}
          >
            <div className="card-header">
              <div className="provider-info">
                <FaUserTie className="provider-icon" />
                <div>
                  <h3>{verification.name}</h3>
                  <span className="experience">1 Experience</span>
                </div>
              </div>
              <span
                className={`status-badge ${verification.status.toLowerCase()}`}
              >
                {verification.status}
              </span>
            </div>

            <div className="card-body">
              <div className="info-row">
                <div className="info-item">
                  <FaBuilding className="info-icon" />
                  <div>
                    <label>Business</label>
                    <p>{verification.name}</p>
                  </div>
                </div>
                <div className="info-item">
                  <FaToolbox className="info-icon" />
                  <div>
                    <label>Service</label>
                    <p>{verification.service}</p>
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
                    <p>{verification.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="documents-section">
                <label>
                  <FaFileAlt /> Submitted Documents
                </label>
                <div className="document-list">
                  {verification.documents.businessPermit ? (
                    <a
                      href={verification.documents.businessPermit}
                      target="_blank"
                      className="document-tag"
                    >
                      Business Permit
                    </a>
                  ) : null}
                  {verification.documents.govId ? (
                    <a
                      href={verification.documents.govId}
                      target="_blank"
                      className="document-tag"
                    >
                      Government ID
                    </a>
                  ) : null}
                  {verification.documents.proofOfIncome ? (
                    <a
                      href={verification.documents.proofOfIncome}
                      target="_blank"
                      className="document-tag"
                    >
                      Proof of Income
                    </a>
                  ) : null}
                  {verification.documents.certification ? (
                    <a
                      href={verification.documents.certification}
                      target="_blank"
                      className="document-tag"
                    >
                      Certification
                    </a>
                  ) : null}
                  {/* {[
                    "Business Permit",
                    "Government ID",
                    "Insurance Certificate",
                  ].map((doc, index) => (
                  ))} */}
                </div>
              </div>
            </div>

            {verification.status === "Pending" && (
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

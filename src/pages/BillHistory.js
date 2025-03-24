import React, { useState, useEffect } from "react";
import "../css/EarningShares.css";
import { all, update } from "../firebase/helper";
import { timestampToDateStringConverter } from "../helpers/TimestampToStringConverter";

const Earnings = () => {
  const [earningsStats, setEarningsStats] = useState({
    totalEarned: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchEarningsData = async () => {
    try {
      const snap = await all("bookings");
      let temp = [];
      let e = 0;
      for (const doc of snap.docs) {
        const data = doc.data();
        if (!data.commissionReference) continue;

        const price = parseInt(data.price);
        const commission = parseInt(price * 0.15);
        e += commission;
        temp.push({
          id: doc.id,
          date: timestampToDateStringConverter(data.paidCommissionAt),
          user: data.providerName,
          refNumber: data.commissionReference,
          amount: commission,
          status: data.commissionStatus,
        });
      }

      setEarningsStats({ totalEarned: e });
      setTransactions(temp);
      setFilteredTransactions(temp);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  useEffect(() => {
    // Filter transactions based on search query
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.user.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, transactions]);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const viewAll = () => [setSearchQuery("")];

  const downloadReceipt = () => {
    alert(
      `Downloading receipt for ${
        selectedTransaction.user
      } - ₱${selectedTransaction.amount.toFixed(2)}`
    );
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await update("bookings", id, {
        commissionStatus: "Completed",
      });
      await fetchEarningsData();

      alert("Successfully marked as paid.");
    } catch (e) {
      alert("Error marking as read!!!");
    }
  };

  return (
    <div className="earning-shares-container">
      <h1 className="page-title">Earnings Overview</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Earned</h3>
          <h2 className="primary-text">
            ₱{earningsStats.totalEarned.toFixed(2)}
          </h2>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="transactions-container">
        <h2>Recent Transactions</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Reference Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.user}</td>
                  <td>{transaction.refNumber}</td>
                  <td>₱{transaction.amount.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.status === "Completed"
                          ? "success"
                          : "warning"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex" }}></div>
                    {transaction.status == "Completed" ? null : (
                      <button
                        className="btn outline-btn"
                        style={{
                          paddingTop: 5,
                          paddingBottom: 5,
                          borderColor: "green",
                          color: "green",
                        }}
                        onClick={() => handleMarkAsPaid(transaction.id)}
                      >
                        Mark as Paid
                      </button>
                    )}
                    <button
                      className="btn outline-btn"
                      style={{ paddingTop: 5, paddingBottom: 5, marginTop: 5 }}
                      onClick={() => handleViewDetails(transaction)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="center-content">
          <button onClick={viewAll} className="btn primary-btn">
            View All Transactions
          </button>
        </div>
      </div>

      {/* Modal for transaction details */}
      {isModalOpen && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Transaction Details</h2>
            <div className="modal-item">
              <i className="fas fa-calendar-alt"></i>
              <p>
                <strong>Date:</strong> {selectedTransaction.date}
              </p>
            </div>
            <div className="modal-item">
              <i className="fas fa-user"></i>
              <p>
                <strong>Name of Sender:</strong> {selectedTransaction.user}
              </p>
            </div>
            <div className="modal-item">
              <i className="fas fa-file-alt"></i>
              <p>
                <strong>Reference Number:</strong>{" "}
                {selectedTransaction.refNumber}
              </p>
            </div>
            <div className="modal-item">
              <i className="fas fa-money-bill-wave"></i>
              <p>
                <strong>Total Amount:</strong> ₱
                {selectedTransaction.amount.toFixed(2)}
              </p>
            </div>
            <div className="modal-actions">
              {/* <button className="btn download-btn" onClick={downloadReceipt}>
                Download as Receipt
              </button> */}
              <button className="btn close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;

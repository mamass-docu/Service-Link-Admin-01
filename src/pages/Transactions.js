import React, { useEffect, useState } from "react";
import "../css/Transactions.css"; // Ensure this CSS file is created
import { all, loadingProcess } from "../firebase/helper";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadingProcess(async () => {
      const snap = await all("bookings");
      setTransactions(
        snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            providerName: data.providerName,
            customerName: data.customerName,
            price: data.price,
            status: data.status,
            date: data.date,
          };
        })
      );
    });
  }, []);

  const onDownloadAsCSV = () => {
    if (transactions.length == 0) {
      alert("No transactions to download");
      return;
    }

    try {
      const csv = Papa.unparse(
        transactions.map((item) => ({
          "Booking ID": item.id,
          "Provider Name": item.providerName,
          "Customer Name": item.customerName,
          Price: item.price,
          Status: item.status,
          Date: item.date,
        }))
      );

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "transactions report.csv");
    } catch (error) {
      console.error("Error saving as csv:", error);
    }
  };

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <h2>Transaction History</h2>
        <button onClick={onDownloadAsCSV} className="download-btn">
          Download as CSV
        </button>
      </header>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Service Provider</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.providerName}</td>
              <td>{transaction.customerName}</td>
              <td>₱{transaction.price}</td>
              <td>{transaction.date}</td>
              <td className={`status ${transaction.status.toLowerCase()}`}>
                {transaction.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer className="pagination">
        <button className="pagination-btn">Previous</button>
        <span className="pagination-info">1</span>
        <button className="pagination-btn">Next</button>
      </footer>
    </div>
  );
};

export default Transactions;

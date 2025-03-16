import React, { useEffect, useState } from "react";
import "../css/Transactions.css"; // Ensure this CSS file is created
import { all, loadingProcess } from "../firebase/helper";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { data } from "react-router-dom";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState([1]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadingProcess(async () => {
      const snap = await all("bookings");
      const data = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          providerName: data.providerName,
          customerName: data.customerName,
          price: data.price,
          status: data.status,
          date: data.date,
        };
      });
      setAllData(data);
      if (data.length < 11) {
        setTransactions(data);
        return;
      }

      let size =  parseInt(data.length / 10)
      if (data.length % 10 != 0)
        size++
      let t = [1];
      setTransactions(data.slice(0, 10));
      for (let i = 2; i <= size; i++) t.push(i);
      setPages(t);
    });
  }, []);

  useEffect(() => {
    setTransactions(allData.slice(10 * (page - 1), 10 * page));
  }, [page]);

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
        <button
          disabled={page == 1}
          className="pagination-btn"
          style={page == 1 ? { backgroundColor: "gray" } : {}}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>
        {pages.map((p) => (
          <span
            key={p}
            onClick={() => setPage(p)}
            className={page == p ? "pagination-btn-active" : "pagination-info"}
          >
            {p}
          </span>
        ))}
        <button
          disabled={page == pages.length}
          className="pagination-btn"
          style={page == pages.length ? { backgroundColor: "gray" } : {}}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default Transactions;

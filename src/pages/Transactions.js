import React, { useEffect, useState } from "react";
import "../css/Transactions.css"; // Ensure this CSS file is created
import { all, loadingProcess } from "../firebase/helper";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { FaSearch } from "react-icons/fa";

const DATA_PER_PAGE = 10;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [pages, setPages] = useState([1]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // Added state for status filter

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
      setFilteredData(data);
      if (data.length <= DATA_PER_PAGE) return;

      setPagesNumbers(data.length);
    });
  }, []);

  useEffect(() => {
    setTransactions(
      filteredData.slice(DATA_PER_PAGE * (page - 1), DATA_PER_PAGE * page)
    );
  }, [page, filteredData]);

  useEffect(() => {
    let filtered = allData;
    const search = searchTerm.trim();
    if (search != "")
      filtered = filtered.filter(
        (item) =>
          item.providerName.toLowerCase().includes(search) ||
          item.customerName.toLowerCase().includes(search)
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
    let t = [1];
    for (let i = 2; i <= size; i++) t.push(i);
    setPages(t);
  };

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <label htmlFor="status-filter" className="filter-label">
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Declined">Declined</option>
            <option value="On Process">On Process</option>
            <option value="Waiting for Confirmation">
              Waiting for Confirmation
            </option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
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
          onClick={() => setPage((prev) => prev - 1)}
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
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default Transactions;

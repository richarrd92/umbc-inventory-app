import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./TransactionReportPage.css";
import "../Pagination.css";

export default function TransactionReportsPage() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/transactions", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const flattened = res.data.flatMap((tx) =>
          tx.transaction_items.map((tItem) => ({
            transactionId: tx.id,
            itemName: tItem.item?.name || "Unknown",
            type: tx.transaction_type,
            quantity: tItem.quantity,
            user: tx.user?.name || tx.user?.email || "Unknown",
            date: tx.created_at,
          }))
        );

        setTransactions(flattened);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };

    fetchTransactions();
  }, [currentUser.token]);

  return (
    <div className="main-content-wrapper">
      <Sidebar
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={currentUser}
      />
  
      <div className="dashboard-container">
        <div className="dashboard-header-container">
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>
          <div className="header-center">
            <h2 className="dashboard-header">Transaction Report</h2>
          </div>
          <div className="header-right">
            <div
              className="cart-icon-container"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>
  
        <div className="transaction-report-page">
          {transactions.length === 0 ? (
            <p className="no-transactions-msg">No transactions available yet.</p>
          ) : (
            <>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.transactionId}</td>
                      <td>{row.itemName}</td>
                      <td>{row.type}</td>
                      <td>{row.quantity}</td>
                      <td>{row.user}</td>
                      <td>{new Date(row.date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              <div className="pagination-container">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="page-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );  
}

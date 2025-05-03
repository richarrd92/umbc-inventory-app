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
  const [expanded, setExpanded] = useState({});

  const itemsPerPage = 5; // number of transaction groups per page
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

        const grouped = res.data.map((tx) => ({
          transactionId: tx.id,
          user: tx.user?.name ?? tx.user?.email ?? `User ID ${tx.user_id}`,
          date: tx.created_at,
          type: tx.transaction_type,
          items: tx.transaction_items.map((tItem) => ({
            id: tItem.id,
            name: tItem.item?.name ?? `Item ID ${tItem.item_id}`,
            quantity: tItem.quantity,
          })),
        }));

        grouped.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
        setTransactions(grouped);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };


    fetchTransactions();
  }, [currentUser.token]);


  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    currentItems.forEach((group) => {
      allExpanded[group.transactionId] = true;
    });
    setExpanded(allExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };


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
              <div className="expand-controls">
                <button onClick={expandAll}>Expand All</button>
                <button onClick={collapseAll}>Collapse All</button>
              </div>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((group) => (
                    <React.Fragment key={group.transactionId}>
                      {/* Parent row */}
                      <tr className="group-header">
                        <td>
                          <button onClick={() => toggleExpand(group.transactionId)}>
                            {expanded[group.transactionId] ? "▼" : "▶"}
                          </button>
                        </td>
                        <td>{group.transactionId}</td>
                        <td>{group.type}</td>
                        <td>{group.user}</td>
                        <td>{new Date(group.date).toLocaleString()}</td>
                      </tr>

                      {/* Expanded rows */}
                      {expanded[group.transactionId] &&
                        group.items.map((item) => (
                          <tr key={item.id} className="group-item">
                            <td></td>
                            <td colSpan={2}>{item.name}</td>
                            <td>Qty: {item.quantity}</td>
                            <td></td>
                          </tr>
                        ))}
                    </React.Fragment>
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

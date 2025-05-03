import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ExportCVPage.css";

export default function ExportCVPage() {
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState("");

  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleDownload = async () => {
    if ((reportType === "orders" || reportType === "transactions") && !dateRange) {
      alert("Please select a date range.");
      return;
    }

    const url = reportType === "inventory"
      ? `http://localhost:8000/export/inventory`
      : `http://localhost:8000/export/${reportType}?range=${dateRange}`;

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${reportType}_${dateRange || "all"}_report.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
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
            <h2 className="dashboard-header">Export CSV Reports</h2>
          </div>
          <div className="header-right">
            <div className="cart-icon-container" onClick={() => navigate("/admin/dashboard")}>
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>

        <div className="export-csv-content">
          <label htmlFor="report-select">Select Report:</label>
          <select
            id="report-select"
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setDateRange(""); // reset date range when report type changes
            }}
          >
            <option value="inventory">Current Inventory</option>
            <option value="orders">Restock Orders</option>
            <option value="transactions">Student Transactions</option>
          </select>

          {/* Conditionally show date range selector */}
          {(reportType === "orders" || reportType === "transactions") && (
            <div className="date-range-selector">
              <label htmlFor="date-range">Select Date Range:</label>
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="">-- Choose a range --</option>
                <option value="past-24h">Past 24 Hours</option>
                <option value="past-week">Past Week</option>
                <option value="past-month">Past Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
          )}

          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={
              (reportType === "orders" || reportType === "transactions") && !dateRange
            }
          >
            Download CSV
          </button>
        </div>

      </div>
    </div>
  );
}

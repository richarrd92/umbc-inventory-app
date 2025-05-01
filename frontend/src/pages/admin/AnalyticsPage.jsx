import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from "chart.js";
import Sidebar from "../../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AnalyticsPage.css";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

export default function AnalyticsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [popularItemsData, setPopularItemsData] = useState(null);
  const [transactionsByHourData, setTransactionsByHourData] = useState(null);
  const [transactionsByDayData, setTransactionsByDayData] = useState(null);
  const [transactionsByUserData, setTransactionsByUserData] = useState(null);
  const [itemsBelowThresholdData, setItemsBelowThresholdData] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/transactions", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const transactions = res.data;

        // ✅ 1️⃣ Popular Items Withdrawn
        const itemCounts = {};
        const userCounts = {};
        transactions.forEach((tx) => {
          // Count transactions by user
          const userName = tx.user?.name || "Unknown";
          userCounts[userName] = (userCounts[userName] || 0) + 1;

          if (tx.transaction_type === "OUT") {
            tx.transaction_items.forEach((item) => {
              const name = item.item?.name || "Unknown";
              itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
            });
          }
        });

        const sortedItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        setPopularItemsData({
          labels: sortedItems.map(([name]) => name),
          datasets: [
            {
              label: "Total Withdrawn",
              data: sortedItems.map(([_, qty]) => qty),
              backgroundColor: "rgba(75, 192, 192, 0.7)",
            },
          ],
        });

        // ✅ 2️⃣ Transactions by Hour
        const hourCounts = Array(24).fill(0);
        transactions.forEach((tx) => {
          const hour = new Date(tx.created_at).getHours();
          hourCounts[hour]++;
        });

        setTransactionsByHourData({
          labels: [...Array(24).keys()].map((h) => `${h}:00`),
          datasets: [
            {
              label: "# Transactions",
              data: hourCounts,
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              fill: true,
            },
          ],
        });

        // ✅ 3️⃣ Transactions by Day
        const dayCounts = Array(7).fill(0);
        transactions.forEach((tx) => {
          const day = new Date(tx.created_at).getDay();
          dayCounts[day]++;
        });

        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        setTransactionsByDayData({
          labels: dayLabels,
          datasets: [
            {
              label: "# Transactions",
              data: dayCounts,
              backgroundColor: "rgba(255, 159, 64, 0.7)",
            },
          ],
        });

        // ✅ 4️⃣ Transactions By User
        const userEntries = Object.entries(userCounts).sort((a, b) => b[1] - a[1]);
        setTransactionsByUserData({
          labels: userEntries.map(([name]) => name),
          datasets: [
            {
              label: "# Transactions",
              data: userEntries.map(([_, count]) => count),
              backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
          ],
        });

      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };

    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:8000/items", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const totalItems = res.data.length;
        const belowThreshold = res.data.filter(
          (item) => item.quantity < item.restock_threshold
        ).length;

        const percent = totalItems === 0 ? 0 : (belowThreshold / totalItems) * 100;

        setItemsBelowThresholdData({
          labels: ["Below Threshold", "Above Threshold"],
          datasets: [
            {
              data: [belowThreshold, totalItems - belowThreshold],
              backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(75, 192, 192, 0.7)"],
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch items", err);
      }
    };

    fetchTransactions();
    fetchItems();
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
            <h2 className="dashboard-header">Analytics Dashboard</h2>
          </div>
          <div className="header-right">
            <div className="cart-icon-container" onClick={() => navigate("/admin/dashboard")}>
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>

        <div className="analytics-grid">

          <div className="analytics-tile">
            <h3>Most Popular Items Withdrawn</h3>
            {popularItemsData ? <Bar data={popularItemsData} options={{ indexAxis: "y" }} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Transactions By Hour</h3>
            {transactionsByHourData ? <Line data={transactionsByHourData} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Transactions By Day of Week</h3>
            {transactionsByDayData ? <Bar data={transactionsByDayData} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Transactions By User</h3>
            {transactionsByUserData ? <Bar data={transactionsByUserData} options={{ indexAxis: "y" }} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Percent of Items Below Restock Threshold</h3>
            {itemsBelowThresholdData ? <Doughnut data={itemsBelowThresholdData} /> : <p>Loading...</p>}
          </div>

        </div>

      </div>
    </div>
  );
}

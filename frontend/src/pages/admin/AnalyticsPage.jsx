import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/transactions", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const transactions = res.data;

        // ✅ 1️⃣ Popular Items Withdrawn
        const itemCounts = {};
        transactions.forEach((tx) => {
          if (tx.transaction_type === "OUT") {
            tx.transaction_items.forEach((item) => {
              const name = item.item?.name || "Unknown";
              itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
            });
          }
        });

        const sortedItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // top 10

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

        // ✅ 3️⃣ Transactions by Day of Week
        const dayCounts = Array(7).fill(0);
        transactions.forEach((tx) => {
          const day = new Date(tx.created_at).getDay(); // 0=Sunday
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
            <h2 className="dashboard-header">Analytics Dashboard</h2>
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

        <div className="analytics-content">
          <h3>Most Popular Items Withdrawn</h3>
          {popularItemsData ? (
            <Bar
              data={popularItemsData}
              options={{
                indexAxis: "y",
                plugins: { legend: { display: false }, title: { display: false } },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}

          <h3>Transactions By Hour</h3>
          {transactionsByHourData ? (
            <Line
              data={transactionsByHourData}
              options={{
                plugins: { legend: { display: false }, title: { display: false } },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}

          <h3>Transactions By Day of Week</h3>
          {transactionsByDayData ? (
            <Bar
              data={transactionsByDayData}
              options={{
                plugins: { legend: { display: false }, title: { display: false } },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

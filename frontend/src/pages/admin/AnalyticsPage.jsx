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

// register chart.js components
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
  const [itemsOrderedInLastOrdersData, setItemsOrderedInLastOrdersData] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/transactions", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const transactions = res.data;

        // Popular Items Withdrawn
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

        // Transactions by Hour
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

        // Transactions by Day
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

        // Transactions By User
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

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/orders", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const orders = res.data
          .filter(order => order.submitted) // only count submitted orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5); // get last 5 orders

        const itemCounts = {};

        orders.forEach(order => {
          order.order_items.forEach(item => {
            const name = item.item?.name || "Unknown";
            itemCounts[name] = (itemCounts[name] || 0) + item.final_quantity;
          });
        });

        const sortedItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        setItemsOrderedInLastOrdersData({
          labels: sortedItems.map(([name]) => name),
          datasets: [
            {
              label: "Quantity Ordered (Last 5 Orders)",
              data: sortedItems.map(([_, qty]) => qty),
              backgroundColor: "rgba(255, 205, 86, 0.7)",
            },
          ],
        });

      } catch (err) {
        console.error("Failed to fetch restock orders", err);
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
    fetchOrders();
    fetchItems();
  }, [currentUser.token]);

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, chartArea: { left, right, top, bottom } } = chart;
      ctx.save();
      const xCenter = (left + right) / 2;
      const yCenter = (top + bottom) / 2;

      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const data = chart.data.datasets[0].data;
      const below = data[0];
      const total = data[0] + data[1];
      const percent = total === 0 ? 0 : Math.round((below / total) * 100);

      ctx.fillText(`${percent}% Below`, xCenter, yCenter);
      ctx.restore();
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
            <h3>Transactions By Hour (Today)</h3>
            {transactionsByHourData ? <Line
              data={transactionsByHourData}
              options={{
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                      callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                      }
                    },
                    beginAtZero: true
                  }
                }
              }}
            /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Transactions Per Day (This Week)</h3>
            {transactionsByDayData ? <Bar data={transactionsByDayData} options={{
              scales: {
                y: {
                  ticks: {
                    stepSize: 1,
                    callback: function (value) {
                      return Number.isInteger(value) ? value : null;
                    }
                  },
                  beginAtZero: true
                }
              }
            }} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Top Users by Transaction Count</h3>
            {transactionsByUserData ? <Bar data={transactionsByUserData} options={{ indexAxis: "y" }} /> : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Percent of Items Below Restock Threshold</h3>
            {itemsBelowThresholdData ? <Doughnut
              data={itemsBelowThresholdData}
              options={{
                maintainAspectRatio: false,
                radius: '90%',
                cutout: '50%',
                plugins: {
                  legend: {
                    position: 'top',
                    align: 'center',
                    labels: {
                      boxWidth: 12,
                      padding: 8,
                      font: { size: 10 }
                    }
                  }
                }
              }}
              plugins={[centerTextPlugin]}
            />
              : <p>Loading...</p>}
          </div>

          <div className="analytics-tile">
            <h3>Top Items Ordered (Last 5 Restock Orders)</h3>
            {itemsOrderedInLastOrdersData ? <Bar data={itemsOrderedInLastOrdersData} options={{ indexAxis: "y" }} /> : <p>Loading...</p>}
          </div>

        </div>

      </div>
    </div>
  );
}

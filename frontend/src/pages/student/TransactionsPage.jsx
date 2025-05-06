// TransactionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import "../Pagination.css";
import "./TransactionsPage.css";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

export default function TransactionsPage() {
  // set variables for order, item arrays
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const [loading, setLoading] = useState(true); // loading state

  const [expandedOrders, setExpandedOrders] = useState(new Set()); // Set to keep track of expanded orders

  // Function to toggle the expanded state of an order
  const toggleOrderItems = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // fetch orders and items table in array
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res1 = await axios.get("http://localhost:8000/transactions", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const res2 = await axios.get("http://localhost:8000/items", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        // Filter out orders with deleted_at === null
        const filtered = res1.data.filter(
          (order) =>
            order.user_id === currentUser.id && order.deleted_at === null
        );

        // Sort orders by created_at
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(filtered); // Set filtered orders
        setItems(res2.data);
      } catch (error) {
        console.error("Failed to fetch orders or items:", error);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchOrders();
  }, [currentUser.id, currentUser.token]);

  // find item in table
  const getItemName = (itemId) => {
    const item = items.find((element) => element.id === itemId);
    return item.name;
  };

  // check if the user has recent orders
  const hasOrders = currentOrders && currentOrders.length > 0;

  // format date of transaction
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="transactions-page">
      <Sidebar
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={currentUser}
      />

      <div className="main-content-container">
        <div className="transactions-header-container">
          {/* Left: Sidebar toggle */}
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>

          {/* Center: Title */}
          <div className="header-center">
            <h2 className="transactions-tb-header">Order History</h2>
          </div>

          {/* Right: Home Icon */}
          <div className="header-right">
            <div
              className="cart-icon-container"
              onClick={() => navigate("/student/dashboard")}
            >
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : hasOrders ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "left", padding: "10px", width: "30%" }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{ textAlign: "left", padding: "10px", width: "55%" }}
                  >
                    Date/Time
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      width: "15%",
                    }}
                  >
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order) => (
                  <>
                    <tr key={order.id}>
                      <td style={{ textAlign: "left", padding: "10px" }}>
                        {order.id}
                      </td>
                      <td style={{ textAlign: "left", padding: "10px" }}>
                        {formatDate(order.created_at)}
                      </td>
                      <td style={{ textAlign: "left", padding: "10px" }}>
                        <button
                          onClick={() => toggleOrderItems(order.id)}
                          className="toggle-items-button"
                        >
                          {expandedOrders.has(order.id)
                            ? "Hide Items"
                            : "Show Items"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrders.has(order.id) && (
                      <tr key={`${order.id}-details`}>
                        <td
                          colSpan="3"
                          style={{
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "1rem",
                              flexWrap: "wrap",
                              justifyContent: "center",
                              backgroundColor: "#f9f9f9",
                              padding: "15px",
                              borderRadius: "8px",
                            }}
                          >
                            {order.transaction_items.map((item) => {
                              const fullItem = items.find(
                                (i) => i.id === item.item_id
                              );
                              return (
                                <div
                                  key={item.id}
                                  style={{
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    textAlignLast: "left",
                                    backgroundColor: "#f9f9f9",
                                  }}
                                >
                                  <strong>
                                    {fullItem?.name || "Unknown Item"}
                                  </strong>
                                  <br />
                                  Category: {fullItem?.category || "N/A"}
                                  <br />
                                  Qty: {item.quantity}
                                  <br />
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="no-past-orders-msg">No recent orders to display.</p>
        )}
        {orders.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

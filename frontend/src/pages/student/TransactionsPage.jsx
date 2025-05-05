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

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // fetch orders and items table in array
  useEffect(() => {
    const fetchOrders = async () => {
      const res1 = await axios.get("http://localhost:8000/transactions", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      const res2 = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      setOrders(res1.data.filter((order) => order.user_id === currentUser.id && order.deleted_at === null));
      setItems(res2.data);
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
    const options = { year: "numeric", month: "long", day: "numeric", hour: 'numeric', minute: 'numeric', hour12: true}
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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
            <h2 className="transactions-tb-header">Your Past Orders</h2>
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
        
        {/* Checks if orders exist to display in table and displays either the table of orders or a paragraph text */}
        {hasOrders ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th
                    style={{ textAlign: "left", padding: "10px", width: "20%" }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      width: "40%",
                    }}
                  >
                    Items
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      width: "40%",
                    }}
                  >
                    Date/Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        width: "20%",
                      }}
                    >
                      {order.id}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        width: "40%",
                      }}
                    >
                      {order.transaction_items.map((item) => (
                        <p key={item.id}>
                          {getItemName(item.item_id)}: {item.quantity}
                        </p>
                      ))}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        width: "40%",
                      }}
                    >
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p>No recent orders to display.</p>
        )}

        {/* Display pagination for table if they exist */}
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
          )};
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PastRestockPage.css";
import Sidebar from "../../components/Sidebar";
import { FaBars } from "react-icons/fa";
import "../Pagination.css";
import { FaHome } from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toastStyles.css";

export default function PastRestockPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMsg, setToastMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // Number of items per page

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/orders/", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        const sorted = res.data.sort((a, b) => {
          // Drafts not submittedgo first
          if (a.submitted !== b.submitted) {
            return a.submitted ? 1 : -1;
          }
          //  sort by created_at descending
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser.token]);

const deleteOrder = async (id) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete Order #${id}?`
  );
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:8000/orders/${id}`, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success(`Order #${id} successfully deleted.`); // Show toast immediately
  } catch (err) {
    console.error("Failed to delete order", err);
    toast.error("Failed to delete order.");
  }
};

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="main-content-wrapper">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        closeButton={false}
        toastClassName={(context) => {
          let base = "toastify-container";
          if (context?.type === "success") return `${base} toast-success`;
          if (context?.type === "error") return `${base} toast-error`;
          if (context?.type === "warn") return `${base} toast-warn`;
          if (context?.type === "info") return `${base} toast-info`;
          return base;
        }}
      />
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
            <h2 className="dashboard-header">Past Restock Orders</h2>
          </div>

          {/* Right: Home Icon */}
          <div className="header-right">
            <div
              className="cart-icon-container"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>

        <div className="past-orders-page">
          {/* {showToast && <div className="toast-notification">{toastMsg}</div>} */}

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <p className="no-restock-msg">No restock orders available yet.</p>
          ) : (
            <>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Created At</th>
                    <th>Submitted At</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((order) => (
                    <tr
                      key={order.id}
                      className={!order.submitted ? "draft" : ""}
                    >
                      <td>{order.id}</td>
                      <td>
                        {new Date(order.created_at + "Z").toLocaleString()}
                      </td>
                      <td>
                        {order.submitted && order.submitted_at
                          ? new Date(order.submitted_at + "Z").toLocaleString()
                          : "---"}
                      </td>
                      <td>
                        {order.created_by?.name ||
                          order.created_by?.email ||
                          "Unknown"}
                      </td>
                      <td className="actions-cell">
                        {order.submitted ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/restock/${order.id}?readonly=true`
                              )
                            }
                          >
                            View
                          </button>
                        ) : (
                          <>
                            {" "}
                            <button
                              onClick={() =>
                                navigate(`/admin/dashboard/restock/${order.id}`)
                              }
                            >
                              Continue
                            </button>
                            <button onClick={() => deleteOrder(order.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

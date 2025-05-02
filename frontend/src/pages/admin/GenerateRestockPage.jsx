import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./GenerateRestockPage.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

export default function GenerateRestockPage() {
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { orderId } = useParams(); // grab /restock/:orderId
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "true";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [clicked, setClicked] = useState(false); // track if generate button has been clicked

  // generate suggested restock order
  const handleGenerateClick = () => {
    setClicked(true);
    generateOrder(); 
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDraft = async () => {
      if (!orderId) return; // skip if no draft is being resumed

      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await axios.get(`http://localhost:8000/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });

        if (res.data.submitted && !isReadOnly) {
          setErrorMsg("This order has already been submitted.");
          return;
        }

        setOrder(res.data);
      } catch (err) {
        console.error("Failed to load order", err);
        setErrorMsg("Could not load draft order.");
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [orderId, currentUser.token]);

  // generate suggested restock order
  const generateOrder = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post(
        "http://localhost:8000/orders/",
        {},
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || "Failed to generate order.");
    } finally {
      setLoading(false);
    }
  };

  // update final_quantity in local state
  const updateFinalQty = (itemId, value) => {
    setOrder((prev) => ({
      ...prev,
      order_items: prev.order_items.map((item) =>
        item.item_id === itemId
          ? { ...item, final_quantity: parseInt(value) || 0 }
          : item
      ),
    }));
  };

  const submitOrder = async () => {
    if (!order) return;

    try {
      // STEP 1: Update the final quantities first
      const updatedItems = order.order_items.map((item) => ({
        item_id: item.item_id,
        final_quantity: item.final_quantity,
      }));

      await axios.put(
        `http://localhost:8000/orders/${order.id}/items`,
        updatedItems,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // STEP 2: Then submit the order
      await axios.post(
        `http://localhost:8000/orders/${order.id}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      setShowSuccess(true);
      setOrder(null);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
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
            <h2 className="dashboard-header">Generate Restock Order</h2>
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
  
        {showSuccess && (
          <div className="toast-notification">
            Order submitted and inventory updated!
          </div>
        )}
  
        <div className="generate-restock-container">
          {order && (
            <p className="order-meta">
              Order #{order.id}{" "}
              {order.submitted
                ? `submitted on ${new Date(
                    order.submitted_at + "Z"
                  ).toLocaleString()}`
                : `created on ${new Date(
                    order.created_at
                  ).toLocaleString()}`}{" "}
              by {order.created_by?.name || "Unknown"}
            </p>
          )}
  
          {!order && (
            <button
              className={`generate-btn ${!clicked ? "pulsing" : ""}`}
              onClick={handleGenerateClick}
              disabled={loading}
            >
              {loading ? "..." : "Generate restock order"}
            </button>
          )}
  
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
  
          {console.log("order:", order)}
  
          {Array.isArray(order?.order_items) && order.order_items.length > 0 ? (
            <>
              <table className="restock-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Item ID</th>
                    <th>Current Stock</th>
                    <th>Withdrawn (7d)</th>
                    <th>Suggested Qty</th>
                    <th>Final Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.item?.name || "Unknown"}</td>
                      <td>{item.item_id}</td>
                      <td>{item.item?.quantity ?? "?"}</td>
                      <td>{item.withdrawn_7d ?? "0"}</td>
                      <td>{item.suggested_quantity}</td>
                      <td>
                        {isReadOnly ? (
                          <span>{item.final_quantity}</span>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <button
                              onClick={() =>
                                updateFinalQty(
                                  item.item_id,
                                  item.final_quantity - 1
                                )
                              }
                              disabled={item.final_quantity <= 0}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={item.final_quantity}
                              onChange={(e) =>
                                updateFinalQty(item.item_id, e.target.value)
                              }
                            />
                            <button
                              onClick={() =>
                                updateFinalQty(
                                  item.item_id,
                                  item.final_quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              {!isReadOnly && (
                <button className="submit-btn" onClick={submitOrder}>
                  Submit Order
                </button>
              )}
            </>
          ) : (
            order && (
              <p className="empty-msg">
                No items to restock.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

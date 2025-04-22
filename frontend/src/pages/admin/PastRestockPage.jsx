import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./PastRestockPage.css";

export default function PastRestockPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
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
      setToastMsg(`Order #${id} successfully deleted.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  return (
    <div className="past-orders-page">
      {showToast && <div className="toast-notification">{toastMsg}</div>}
      <h2>Past Restock Orders</h2>
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
          {orders.map((order) => (
            <tr key={order.id} className={!order.submitted ? "draft" : ""}>
              <td>{order.id}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                {order.submitted && order.created_at
                  ? new Date(order.created_at).toLocaleString()
                  : "---"}
              </td>
              <td>{order.created_by?.name || order.created_by?.email || "Unknown"}</td>
              <td>
                {order.submitted ? (
                  <button
                  onClick={() =>
                    navigate(`/admin/dashboard/restock/${order.id}?readonly=true`)
                  }
                >
                  View
                </button>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/admin/dashboard/restock/${order.id}`)
                      }
                    >
                      Continue
                    </button>
                    <button onClick={() => deleteOrder(order.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

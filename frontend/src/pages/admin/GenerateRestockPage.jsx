import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import "./GenerateRestockPage.css";
import { useNavigate } from "react-router-dom";


export default function GenerateRestockPage() {
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();



  // generate suggested restock order
  const generateOrder = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post("http://localhost:8000/orders/", {}, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
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
      await axios.post(
        `http://localhost:8000/orders/${order.id}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      setShowSuccess(true);
      setOrder(null);

      // wait 2 seconds, then hide redirect
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
    <>
      {showSuccess && (
        <div className="toast-notification">
          Order submitted and inventory updated!
        </div>
      )}

      <div className="generate-restock-container">
        {order && (
          <p className="order-meta">
            Order #{order.id} created on{" "}
            {new Date(order.created_at).toLocaleString()} by {currentUser.name}
          </p>
        )}

        {!order && (
          <button onClick={generateOrder} disabled={loading}>
            {loading ? "Generating..." : "Generate Suggested Order"}
          </button>
        )}

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        {order && (
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
                      <input
                        type="number"
                        min="0"
                        value={item.final_quantity}
                        onChange={(e) =>
                          updateFinalQty(item.item_id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="submit-btn" onClick={submitOrder}>
              Submit Order
            </button>
          </>
        )}
      </div>
    </>
  );

}

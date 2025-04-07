// src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

// Cart component
export default function Cart() {
  const { cart, removeFromCart, clearCart, decreaseQuantity, addToCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableStock, setAvailableStock] = useState({});
  // const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch item availability for quantity limits
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("http://localhost:8000/items", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const stockMap = {}; // Map to store item IDs and quantities
        res.data.forEach((item) => {
          stockMap[item.id] = item.quantity;
        });
        setAvailableStock(stockMap); // Update available stock
      } catch (err) {
        console.error("Failed to fetch item stock:", err);
      }
    };

    fetchStock();
  }, [user.token]); // Dependency on user token

  // Function to handle remove
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  // Function to handle increment
  const handleIncrement = (item) => {
    const stock = availableStock[item.id] || 0; // Get stock for the item
    if (item.quantity < stock) {
      addToCart({ ...item, quantity: item.quantity + 1 });
    }
  };

  // Function to handle decrement
  const handleDecrement = (itemId, quantity) => {
    if (quantity > 1) {
      decreaseQuantity(itemId);
    } else {
      removeFromCart(itemId);
    }
  };

  // Function to handle checkout
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    console.log("User ID from handleOrder:", user.id);

    // Prepare the transaction payload
    const transactionPayload = {
      user_id: user.id,
      transaction_type: "OUT", // 'OUT' for checkout (items are being removed from inventory)
      notes: "Enter any additional notes here", // Optional - should be documented by admin
      transaction_items: cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity, // Use item quantity for checkout
      })),
    };

    try {
      setLoading(true);
      // Create the transaction (student checkout)
      const transactionResponse = await axios.post(
        "http://localhost:8000/transactions/",
        transactionPayload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the transaction response contains the expected transaction ID
      if (!transactionResponse.data || !transactionResponse.data.id) {
        throw new Error(
          "Transaction creation failed, missing transaction ID in response."
        );
      }

      alert("Order placed successfully!");
      clearCart(); // Clear the cart after placing the order
      navigate("/dashboard"); // Navigate back to the dashboard
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="cart-empty">No items selected.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => {
              const stock = availableStock[item.id] || 0;
              return (
                <li key={item.id} className="cart-item">
                  <div className="item-info">
                    {item.name} — Qty: {item.quantity}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      disabled={item.quantity <= 0}
                      className="action-btn"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleIncrement(item)}
                      disabled={item.quantity >= stock}
                      className="action-btn"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart-actions">
            <button
              className="dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

            <button
              onClick={handleOrder}
              className="order-btn"
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}

      {/* <div className="dashboard-btn-container">
        <button
          className="dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div> */}
    </div>
  );
}

// src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastStyles.css";

// Cart component
export default function Cart() {
  const { cart, removeFromCart, clearCart, decreaseQuantity, addToCart } =
    useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [availableStock, setAvailableStock] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch item availability for quantity limits
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("http://localhost:8000/items", {
          headers: { Authorization: `Bearer ${currentUser.token}` },
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
  }, [currentUser.token]); // Dependency on currentUser token

  // Function to handle remove
  const handleRemove = (id) => {
    removeFromCart(id);

    // If cart is now empty, navigate back to dashboard
    if (cart.length === 1) {
      // toast.error("Your cart is now empty.");
      navigate(
        `/${currentUser.role === "admin" ? "admin" : "student"}/dashboard`
      );
      clearCart();
    }
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
      toast.error("Your cart is empty.");
      return;
    }

    setLoading(true);

    const transactionPayload = {
      user_id: currentUser.id,
      transaction_type: "OUT",
      notes: "Enter any additional notes here",
      transaction_items: cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/transactions/",
        transactionPayload,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data || !response.data.id) {
        toast.error("Failed to place order. Please try again.");
        throw new Error("Missing transaction ID in response.");
      }

      toast.success("Order placed successfully!");

      // Clear cart and redirect after toast
      setTimeout(() => {
        clearCart();
        navigate(
          `/${currentUser.role === "admin" ? "admin" : "student"}/dashboard`
        );
      }, 2000);
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
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
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <>
          <p className="cart-empty">No items selected.</p>
          <div className="cart-actions">
            <button
              className="dashboard-btn"
              onClick={() =>
                navigate(
                  `/${
                    currentUser.role === "admin" ? "admin" : "student"
                  }/dashboard`
                )
              }
            >
              Back to Dashboard
            </button>
            <div style={{ width: "140px" }}></div>
          </div>
        </>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => {
              const stock = availableStock[item.id] || 0;
              return (
                <li key={item.id} className="cart-item">
                  <div className="item-info">
                    <div className="item-name">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-label">{item.name}</span>
                    </div>
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
              onClick={() =>
                navigate(
                  `/${
                    currentUser.role === "admin" ? "admin" : "student"
                  }/dashboard`
                )
              }
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleOrder}
              className="order-btn"
              disabled={loading}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  // Get cart actions and state
  const { cart, removeFromCart, clearCart } = useCart();

  // Auth and navigation
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle order placement
  const handleOrder = async () => {
    try {
      await axios.post(
        "http://localhost:8000/orders",
        {
          items: cart.map((item) => item.id), // Send only item IDs
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }, // Auth header
        }
      );
      clearCart(); // Empty cart after order
      alert("Order placed!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>

      {/* Show message if cart is empty */}
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          {/* List cart items */}
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name}{" "}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          {/* Order button */}
          <button onClick={handleOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

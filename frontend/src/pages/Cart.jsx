// src/pages/Cart.jsx
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOrder = async () => {
    try {
      await axios.post(
        "http://localhost:8000/orders",
        {
          items: cart.map((item) => item.id),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      clearCart();
      alert("Order placed!");
      navigate("/dashboard");
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name}{" "}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={handleOrder}>Place Order</button>
        </>
      )}
    </div>
  );
}

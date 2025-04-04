// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch available items from the backend
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${user.token}` }, // Authorization header with token
      });
      setItems(res.data); // Set the fetched items in state
    };
    fetchItems(); // Call function to fetch items
  }, [user.token]);

  return (
    <div>
      <h2>Available Items</h2>
      {/* Logout Button triggers Logout */}
      {/* <button onClick={LogoutButton}>Logout</button> */}
      <LogoutButton />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <b>{item.name}</b> - {item.description} <br />
            {/* Add item to cart */}
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

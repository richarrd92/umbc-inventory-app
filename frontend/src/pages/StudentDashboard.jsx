// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Available Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <b>{item.name}</b> - {item.description} <br />
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

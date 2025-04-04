import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);

      // Initialize quantity for each item to 0
      const initialQuantities = {};
      res.data.forEach(item => {
        initialQuantities[item.id] = 0;
      });
      setQuantities(initialQuantities);
    };
    fetchItems();
  }, [user.token]);

  const handleQuantityChange = (itemId, newQty) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, newQty), // prevent negatives
    }));
  };

  const handleFinishCheckout = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => ({ id: parseInt(id), quantity: qty }));

    console.log("Items for checkout:", selectedItems);

    // TODO: send `selectedItems` to backend
    alert("Checkout submitted! (Functionality coming soon)");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Items</h2>
      <LogoutButton />

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px" }}>Item</th>
            <th style={{ textAlign: "center", padding: "10px" }}>Available</th>
            <th style={{ textAlign: "center", padding: "10px" }}>Checkout</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "10px" }}>{item.name}</td>
              <td style={{ textAlign: "center" }}>{item.quantity}</td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={quantities[item.id] || 0}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  style={{ width: "60px", padding: "4px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
        <button onClick={() => window.history.back()}>Go Back</button>
        <button onClick={handleFinishCheckout} style={{ backgroundColor: "#ffb81c", padding: "0.5rem 1rem", fontWeight: "bold" }}>
          Finish Checkout
        </button>
      </div>
    </div>
  );
}

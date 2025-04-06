import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { FaShoppingCart } from "react-icons/fa";
import "./StudentDashboard.css";
import "./Pagination.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [originalStock, setOriginalStock] = useState({}); // Track initial stock
  const [quantities, setQuantities] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); // Cart context
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5; // Number of items per page
  console.log("User ID check from StudentDashboard:", user.id);

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setItems(res.data); // Update items

      const initialStock = {};
      const initialQuantities = {};

      // Initialize stock and quantities
      res.data.forEach((item) => {
        initialStock[item.id] = item.quantity;
        const cartItem = cart.find((i) => i.id === item.id);
        initialQuantities[item.id] = cartItem ? cartItem.quantity : 0;
      });

      setOriginalStock(initialStock);
      setQuantities(initialQuantities);
    };

    fetchItems();
  }, [user.token]);

  // Function to handle quantity changes
  const handleQuantityChange = (itemId, inputValue) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const parsedValue = parseInt(inputValue, 10);
    const newQty = isNaN(parsedValue) ? 0 : Math.max(0, parsedValue);
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQty,
    }));

    if (newQty === 0) {
      removeFromCart(itemId);
    } else {
      addToCart({ id: item.id, name: item.name, quantity: newQty });
    }
  };

  // Calculate total cart items
  const totalCartItems = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  // Calculate derived available stock from original - quantities
  const getAvailableStock = (itemId) => {
    return (originalStock[itemId] || 0) - (quantities[itemId] || 0);
  };

  // Validate checkout attempt
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    navigate("/cart");
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-container">
        <h2 className="dashboard-header">Available Items</h2>
        <div className="cart-icon-container" onClick={handleCheckout}>
          <FaShoppingCart className="cart-icon" />
          {totalCartItems > 0 && (
            <span className="cart-count">{totalCartItems}</span>
          )}
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px", width: "60%" }}>
              Item
            </th>
            <th style={{ textAlign: "center", padding: "10px", width: "20%" }}>
              Available
            </th>
            <th style={{ textAlign: "center", padding: "10px", width: "20%" }}>
              Checkout
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "10px", width: "60%" }}>{item.name}</td>
              <td style={{ textAlign: "center", width: "20%" }}>
                {getAvailableStock(item.id)}
              </td>
              <td style={{ textAlign: "center", width: "20%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, (quantities[item.id] || 0) - 1)
                    }
                    disabled={(quantities[item.id] || 0) <= 0}
                    style={{ padding: "0 5px" }}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantities[item.id] !== undefined ? quantities[item.id] : ""}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    style={{ width: "45px", textAlign: "center", padding: "2px" }}
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)
                    }
                    disabled={(quantities[item.id] || 0) >= originalStock[item.id]}
                    style={{ padding: "0 5px" }}
                  >
                    +
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="page-info">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="button-container">
        <LogoutButton />
        {/* <div style={{ margin: "20px 0" }}>
          <label>
            Notes:{" "}
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. I grabbed snacks"
              style={{ width: "300px", padding: "5px" }}
            />
          </label>
        </div> */}
        <button className="finish-button" onClick={handleCheckout}>
          Check Out
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FaShoppingCart } from "react-icons/fa";
import "./StudentDashboard.css";
import "./Pagination.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [originalStock, setOriginalStock] = useState({}); // Track initial stock
  const [quantities, setQuantities] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); // Cart context
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const itemsPerPage = 5; // Number of items per page
  console.log("currentUser ID check from StudentDashboard:", currentUser.id);

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      // ******************************************************************************
      // MAY NEED TO LET ADMINS BE ABLE TO SEE EMPTY ITEMS

      const availableItems = res.data.filter((item) => item.quantity > 0);
      setItems(availableItems); // only show items with quantity > 0

      // ******************************************************************************

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
  }, [currentUser.token]);


  const handleDelete = async (itemId, itemName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${itemName}"?`);
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/items/${itemId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setToastMsg("Item deleted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      // refetch updated list
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setItems(res.data.filter((item) => item.quantity > 0));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item.");
    }
  };


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
    navigate("/admin/dashboard/cart");
    console.log("currentUser ID from handleCheckout:", currentUser.id);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="main-content-wrapper">
      <Sidebar
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={currentUser}
      />

      {/* <div className="student-dashboard-content"> */}
      <div className="dashboard-container">
        <div className="dashboard-header-container">
        {showToast && <div className="toast-notification">{toastMsg}</div>}
          {/* Left: Sidebar toggle */}
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>

          {/* Center: Title */}
          <div className="header-center">
            <h2 className="dashboard-header">Available Items</h2>
          </div>

          {/* Right: Cart Icon */}
          <div className="header-right">
            <div className="cart-icon-container" onClick={handleCheckout}>
              <FaShoppingCart className="cart-icon" />
              {totalCartItems > 0 && (
                <span className="cart-count">{totalCartItems}</span>
              )}
            </div>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "10px", width: "60%" }}>
                Item
              </th>
              <th
                style={{ textAlign: "center", padding: "10px", width: "20%" }}
              >
                Available
              </th>
              <th
                style={{ textAlign: "center", padding: "10px", width: "20%" }}
              >
                Checkout
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "10px", width: "60%" }}>
                  {item.name}
                  <div style={{ marginTop: "4px" }}>
                    <button
                      onClick={() => navigate(`/admin/dashboard/edit-item/${item.id}`)}
                      style={{ marginRight: "6px", fontSize: "0.8rem" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      style={{ fontSize: "0.8rem", color: "red" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
                <td style={{ textAlign: "center", width: "20%" }}>
                  {getAvailableStock(item.id)}
                </td>
                <td style={{ textAlign: "center", width: "20%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          (quantities[item.id] || 0) - 1
                        )
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
                      value={
                        quantities[item.id] !== undefined
                          ? quantities[item.id]
                          : ""
                      }
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      style={{
                        width: "45px",
                        textAlign: "center",
                        padding: "2px",
                      }}
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          (quantities[item.id] || 0) + 1
                        )
                      }
                      disabled={
                        (quantities[item.id] || 0) >= originalStock[item.id]
                      }
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
      </div>
    </div>
  );
}

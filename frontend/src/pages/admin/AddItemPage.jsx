import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
import "../Pagination.css";
import "./AddItemPage.css";
import { FaBars, FaHome } from "react-icons/fa";

export default function AddItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [restockThreshold, setRestockThreshold] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(quantity) < 1 || parseInt(restockThreshold) < 1) {
      alert("Quantity and Restock Threshold must be at least 1.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/items",
        {
          name,
          description,
          quantity: parseInt(quantity),
          restock_threshold: parseInt(restockThreshold),
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setShowSuccess(true);
      setName("");
      setDescription("");
      setQuantity("");
      setRestockThreshold("");

      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  return (
    <div className="add-items-page">
      <Sidebar
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={currentUser}
      />
      <div className="main-content-container">
        <div className="add-items-header-container">
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>
          <div className="header-center">
            <h2 className="add-items-header">Add Items To Inventory</h2>
          </div>
          <div className="header-right">
            <div
              className="cart-icon-container"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="toast-notification">Item added to inventory!</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Item Name:</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />

          <label>Description (optional):</label>
          <br />
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />

          <label>Quantity:</label>
          <br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
          <br />

          <label>Restock Threshold:</label>
          <br />
          <input
            type="number"
            value={restockThreshold}
            onChange={(e) => setRestockThreshold(e.target.value)}
            min="1"
            required
          />
          <br />

          <div className="button-container">
            <button type="submit">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

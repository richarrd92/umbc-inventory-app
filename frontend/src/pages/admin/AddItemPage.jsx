import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";import Sidebar from "../../components/Sidebar";
import "../Pagination.css";
import "./AddItemPage.css";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

// AddItemPage.jsx
export default function AddItemPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useAuth(); // Get authenticated user
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle form submission to add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/items",
        {
          name,
          description,
          quantity: parseInt(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Send auth token
          },
        }
      );
      alert("Item added!");
      setName("");
      setDescription("");
      setQuantity("");
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
          user={user}
        />
        <div className="main-content-container">
          <div className="add-items-header-container">
            {/* Left: Sidebar toggle */}
            <div className="header-left">
              <div className="sidebar-toggle-button" onClick={toggleSidebar}>
                <FaBars size={24} />
              </div>
            </div>

            {/* Center: Title */}
            <div className="header-center">
              <h2 className="add-items-header">Add Items To Inventory</h2>
            </div>

            {/* Right: Home Icon */}
            <div className="header-right">
              <div
                className="cart-icon-container"
                onClick={() => navigate("/admin/dashboard")}
              >
                <FaHome className="cart-icon" />
              </div>
            </div>
          </div>

        {/* Item submission form */}
        <form onSubmit={handleSubmit}>
          <label>Item Name:</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />

          <label>Description:</label>
          <br />
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br />

          <label>Quantity:</label>
          <br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <br />

          {/* Submit button */}
          <div className="button-container">
            <button type="submit">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}

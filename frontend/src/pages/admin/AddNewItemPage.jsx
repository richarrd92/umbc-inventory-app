import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AddNewItemPage.css";
import Sidebar from "../../components/Sidebar";
import { FaBars, FaHome } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toastStyles.css";

export default function AddNewItemPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [restockThreshold, setRestockThreshold] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle form submission to add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new submission

    const quantityNum = parseInt(quantity);
    const thresholdNum = parseInt(restockThreshold);

    // Validation: quantity and threshold must be ≥ 1
    if (quantityNum < 1 || thresholdNum < 1) {
      setErrorMessage("Quantity and Restock Threshold must be at least 1.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/items",
        {
          name,
          category,
          quantity: parseInt(quantity),
          restock_threshold: parseInt(restockThreshold),
          user_id: currentUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // If item is successfully added, reset form and show success message
      setName("");
      setCategory("");
      setQuantity("");
      setRestockThreshold("");
      toast.success("Item added successfully!");
    } catch (err) {
      console.error(err); // Log error
      console.log("Error adding item:", err);

      // Set error message
      if (err.response && err.response.data && err.response.data.detail) {
        setErrorMessage(err.response.data.detail);
        toast.error("Item with this name and category already exists");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="main-content-wrapper">
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
          return base;
        }}
      />
      <Sidebar
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        user={currentUser}
      />

      <div className="dashboard-container">
        <div className="dashboard-header-container">
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>

          <div className="header-center">
            <h2 className="dashboard-header">Add New Item</h2>
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

        <div className="add-item-page">
          <form onSubmit={handleSubmit} className="add-item-form">
            <label>Name:</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter item name"
              className="item-name-input-field"
            />

            <label>Category:</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Enter item category"
              className="item-category-input-field"
            />

            <div className="input-pair">
              <div className="input-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>
              <div className="input-group">
                <label>Restock Threshold:</label>
                <input
                  type="number"
                  value={restockThreshold}
                  onChange={(e) => setRestockThreshold(e.target.value)}
                  required
                  placeholder="Enter restock threshold"
                  min="1"
                />
              </div>
            </div>

            <button type="submit" className="submit-button">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

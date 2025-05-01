import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
import "./ManageItemsPage.css";
import "../Pagination.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toastStyles.css";
import {
  FaBars,
  FaHome,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AddNewItemPage.css";

export default function ManageItemsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    fetchItems();
  }, [currentUser]);

  // Fetch items
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      setErrorMessage("Failed to fetch items.");
    }
  };

  // Edit item
  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditedItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      restock_threshold: item.restock_threshold,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditedItem({});
    setErrorMessage(""); // Reset error message
  };

  // Handle edit form changes
const handleEditChange = (field, value) => {
  if (field === "quantity" || field === "restock_threshold") {
    const number = parseInt(value, 10);

    // Validate quantity and restock threshold
    if (isNaN(number) || number < 0) {
        toast.error("Please enter a valid non-negative number.");
        return;
    } else {
      setEditedItem((prev) => ({ ...prev, [field]: number }));
    }
  } else {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  }
};


// Save edited item
const saveEdit = async (id) => {
  const originalItem = items.find((item) => item.id === id);
  const hasChanged = Object.keys(editedItem).some(
    (key) => editedItem[key] !== originalItem[key]
  );

  // If no changes were made, cancel editing
  if (!hasChanged) {
    setEditingItemId(null);
    setEditedItem({});
    return;
  }

  try {
    await axios.put(`http://localhost:8000/items/${id}`, editedItem, {
      headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    setEditingItemId(null);
    fetchItems();
    setErrorMessage("");
    toast.success("Item updated successfully!");
  } catch (err) {
    console.error("Error updating item:", err);
    if (err.response?.data?.detail) {
      setErrorMessage(err.response.data.detail);
      toast.error(err.response.data.detail);
    } else {
      setErrorMessage("Failed to update item.");
      toast.error("Failed to update item.");
    }
  }
};

  // Delete item
  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/items/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err);
      setErrorMessage("Failed to delete item.");
      toast.error("Failed to delete item.");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Change page
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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
            <h2 className="dashboard-header">Manage Items</h2>
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

        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Restock Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  {editingItemId === item.id ? (
                    <>
                      <td>
                        <input
                          value={editedItem.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editedItem.category}
                          onChange={(e) =>
                            handleEditChange("category", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editedItem.quantity}
                          min="1"
                          onChange={(e) =>
                            handleEditChange("quantity", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editedItem.restock_threshold}
                          min="1"
                          onChange={(e) =>
                            handleEditChange(
                              "restock_threshold",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="action-buttons">
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="submit-button"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="delete-button"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{item.restock_threshold}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => startEditing(item)}
                          className="submit-button"
                        >
                          <FaEdit /> Update
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="delete-button"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-container">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";
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
import "./ManageItemsPage.css"; // Reuse Items page styling

export default function ManageUsersPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users", {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMessage("Failed to fetch users.");
    }
  };

  // Start editing a user
  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditedUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditedUser({});
    setErrorMessage(""); // Reset error message
  };

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    if (field === "email") {
      if (!value.endsWith("@umbc.edu")) {
        setEmailError("Email must end with @umbc.edu");
        toast.error("Email must end with @umbc.edu", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      } else {
        setEmailError("");
      }
    }

    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save edited user
  const saveEdit = async (id) => {
    const originalUser = users.find((user) => user.id === id);
    const hasChanged = Object.keys(editedUser).some(
      (key) => editedUser[key] !== originalUser[key]
    );

    // If no changes were made, cancel editing
    if (!hasChanged) {
      setEditingUserId(null);
      setEditedUser({});
      return;
    }

    try {
      await axios.put(`http://localhost:8000/users/${id}`, editedUser, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setEditingUserId(null);
      fetchUsers();
      setErrorMessage("");
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user.");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/users/${id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

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
            <h2 className="dashboard-header">Manage Users</h2>
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
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  {editingUserId === user.id ? (
                    <>
                      <td>
                        <input
                          value={editedUser.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editedUser.email}
                          onChange={(e) =>
                            handleEditChange("email", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={editedUser.role}
                          onChange={(e) =>
                            handleEditChange("role", e.target.value)
                          }
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="action-buttons">
                        <button
                          onClick={() => saveEdit(user.id)}
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
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => startEditing(user)}
                          className="submit-button"
                        >
                          <FaEdit /> Update
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
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

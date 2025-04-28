import "./EssentialItemsPage.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../components/Sidebar.css";
import { FaBars, FaHome } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
          {/* Left: Sidebar toggle */}
          <div className="header-left">
            <div className="sidebar-toggle-button" onClick={toggleSidebar}>
              <FaBars size={24} />
            </div>
          </div>

          {/* Center: Title */}
          <div className="header-center">
            <h2 className="dashboard-header">Essential Items</h2>
          </div>

          {/* Right: Cart Icon */}
          <div className="header-right">
            <div
              className="cart-icon-container"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaHome className="cart-icon" />
            </div>
          </div>
        </div>
        <div className="manage-items-container">
          <div className="grid-container">
            <div className="grid-item" onClick={() => navigate("/admin/dashboard/add-item")}>
              <h3 className="grid-item-label">Add New Item</h3>
            </div>

            <div className="grid-item" onClick={() => navigate("/admin/dashboard/update-item")}>
              <h3 className="grid-item-label">Update Item</h3>
            </div>

            <div className="grid-item" onClick={() => navigate("/admin/dashboard/delete-item")}>
              <h3 className="grid-item-label">Delete Item</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

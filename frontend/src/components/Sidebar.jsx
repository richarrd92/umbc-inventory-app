import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import "./Sidebar.css";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar, user }) {
  const { currentUser } = useAuth(); 
  const sidebarRef = useRef(); // Reference to the sidebar

  useEffect(() => {
    // Function to handle clicks outside the sidebar
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        toggleSidebar(); // Close sidebar when clicking outside
      }
    };

    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // If sidebar is not open, return null
  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay">
      <div className={`sidebar open`} ref={sidebarRef}>
        <div className="sidebar-header">
          <FaUserCircle size={24} />
          <span>{currentUser.name || "Student"}</span>
        </div>
        <button onClick={toggleSidebar} className="close-btn">
          ✖
        </button>
        <div className="sidebar-content">
          <button className="sidebar-btn">Past Orders (coming soon)</button>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

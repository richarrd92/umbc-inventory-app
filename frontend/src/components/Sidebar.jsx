import { FaUserCircle } from "react-icons/fa";
import LogoutButton from "./LogoutButton";
import "./Sidebar.css";
import { useAuth } from "../contexts/AuthContext";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar, user }) {
  const { currentUser } = useAuth();
  const sidebarRef = useRef(); // Reference to the sidebar
  const navigate = useNavigate();


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
        {" "}
        <div className="sidebar-header">
          <FaUserCircle size={24} />
          <span>{currentUser.name || "Student"}</span>
        </div>
        <button onClick={toggleSidebar} className="close-btn">
          ✖
        </button>
        <div className="sidebar-content">
          <svg
            className="flag-pattern"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                patternTransform="rotate(-6) scale(250)"
                id="pattern"
                x="0"
                y="0"
                width="1"
                height="0.667"
                patternUnits="userSpaceOnUse"
                fill="currentColor"
              >
                <path d="M.416.333V.222L.333.166v.112zM.084 0l.083.055V0zM.333.166V0H.25v.11L.167.056v.112L.25.223V.11zM0 0v.056l.084.056V0zM.167.333V.167L.084.112v.221zM.833.612L.75.556v.111h.083V.612l.083.055V.555L.833.5zM.916.555L1 .611V.333H.916z"></path>
                <path d="M.25.333v.023a.021.021 0 01.021.021V.39h.02a.021.021 0 010 .042h-.02v.048h.134V.46a.021.021 0 11.042 0v.02h.018A.021.021 0 01.485.5H.25v.144A.021.021 0 00.271.623V.612h.02a.021.021 0 100-.043h-.02V.521h.134v.02a.021.021 0 10.042 0v-.02h.018a.021.021 0 00.02-.02H.5V.388l.084.056V.333L.667.39V.333H.75v.111L.667.39V.5L.75.556V.444L.833.5V.333H.75V.31A.021.021 0 01.729.29V.277h-.02A.021.021 0 01.708.236h.02V.188H.596v.02a.021.021 0 11-.042 0v-.02H.535a.021.021 0 01-.02-.021H.5V0H.416v.222L.5.278v.055H.333V.278L.25.223z"></path>
                <path d="M.667.667V.501L.584.445v.222zM.75 0v.023a.021.021 0 01.021.02v.012h.02a.021.021 0 010 .043h-.02v.048h.134v-.02a.021.021 0 11.042 0v.02h.018a.021.021 0 01.02.02H1V0zM.729.044v.011h-.02a.021.021 0 000 .043h.02v.048H.595v-.02A.021.021 0 10.553.125v.02H.535a.021.021 0 00-.02.022H.75V.023a.021.021 0 00-.021.02zM.926.229A.021.021 0 00.947.208v-.02h.018a.021.021 0 00.02-.021H.75V.31A.021.021 0 00.771.29V.277h.02a.021.021 0 100-.042h-.02V.188h.134v.02a.021.021 0 00.021.02zM.229.623V.612h-.02a.021.021 0 110-.043h.02V.521H.095v.02a.021.021 0 11-.042 0v-.02H.035a.021.021 0 01-.02-.02H0v.166h.25V.644A.021.021 0 01.229.623zM.229.377V.39h-.02a.021.021 0 000 .042h.02v.048H.095V.46a.021.021 0 10-.042 0v.02H.035A.021.021 0 00.015.5H.25V.356a.021.021 0 00-.021.021z"></path>
              </pattern>
            </defs>
            <rect fill="url(#pattern)" width="100%" height="100%"></rect>
          </svg>

          {/* Admin-only buttons */}
          {currentUser.role === "admin" && (
            <>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/Essential-Items");
                  toggleSidebar();
                }}
              >
                Essential Items
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/favorites");
                  toggleSidebar();
                }}
              >
                Favorites Orders
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/transactions");
                  toggleSidebar();
                }}
              >
                Past Transactions
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/analytics");
                  toggleSidebar();
                }}
              >
                Analytics
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/restock");
                  toggleSidebar();
                }}
              >
                Generate Restock Order
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/past-restocks");
                  toggleSidebar();
                }}
              >
                Past Restock Orders
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/transaction-report");
                  toggleSidebar();
                }}
              >
                Transaction Report
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/export-cv");
                  toggleSidebar();
                }}
              >
                Export CV Report
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/admin/dashboard/report-issue");
                  toggleSidebar();
                }}
              >
                Report Issue
              </button>
            </>
          )}
          {/* Student-only buttons */}
          {currentUser.role === "student" && (
            <>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/student/dashboard/favorites");
                  toggleSidebar();
                }}
              >
                Favorites Orders
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/student/dashboard/transactions");
                  toggleSidebar();
                }}
              >
                Past Transactions
              </button>
              <button
                className="sidebar-btn"
                onClick={() => {
                  navigate("/student/dashboard/report-issue");
                  toggleSidebar();
                }}
              >
                Report Issue
              </button>
            </>
          )}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return <h1>Export Page</h1>;
}

// import React, { useState } from "react";
// import axios from "axios";
// import Sidebar from "../../components/Sidebar";
// import { FaBars, FaHome } from "react-icons/fa";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./ExportCSVPage.css";

// export default function ExportCSVPage() {
//   const { currentUser } = useAuth();
//   const [reportType, setReportType] = useState("inventory");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   const handleExport = async () => {
//     try {
//       const res = await axios.get(`http://localhost:8000/export/${reportType}`, {
//         headers: {
//           Authorization: `Bearer ${currentUser.token}`,
//         },
//         responseType: "blob", // important for file download
//       });

//       const blob = new Blob([res.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${reportType}-report.csv`);
//       document.body.appendChild(link);
//       link.click();
//     } catch (err) {
//       console.error("Export failed", err);
//     }
//   };

//   return (
//     <div className="main-content-wrapper">
//       <Sidebar
//         className={`sidebar ${sidebarOpen ? "open" : ""}`}
//         isOpen={sidebarOpen}
//         toggleSidebar={toggleSidebar}
//         user={currentUser}
//       />

//       <div className="dashboard-container">
//         <div className="dashboard-header-container">
//           <div className="header-left">
//             <div className="sidebar-toggle-button" onClick={toggleSidebar}>
//               <FaBars size={24} />
//             </div>
//           </div>
//           <div className="header-center">
//             <h2 className="dashboard-header">Export Reports to CSV</h2>
//           </div>
//           <div className="header-right">
//             <div
//               className="cart-icon-container"
//               onClick={() => navigate("/admin/dashboard")}
//             >
//               <FaHome className="cart-icon" />
//             </div>
//           </div>
//         </div>

//         <div className="export-report-container">
//           <label>Select Report:</label>
//           <select onChange={(e) => setReportType(e.target.value)} value={reportType}>
//             <option value="inventory">Current Inventory</option>
//             <option value="orders">Past Restock Orders (7d)</option>
//             <option value="transactions">Transactions (7d)</option>
//           </select>

//           <button onClick={handleExport}>Download CSV</button>
//         </div>
//       </div>
//     </div>
//   );
// }

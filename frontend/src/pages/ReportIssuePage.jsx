import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import './ReportIssuePage.css'

export default function ReportIssuePage() {
  /* Get user and navigation and set email and feedback values */
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    try{
      setEmail("");
      setFeedback("");
      toast.success("Feedback sent!");
    }catch(err){
      console.error(err);
      setErrorMessage(err);
      toast.error("Error sending feedback.");
    }
  }
  
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
            {/* Display sidebar */}
            <div className="header-left">
              <div className="sidebar-toggle-button" onClick={toggleSidebar}>
                <FaBars size={24} />
              </div>
            </div>
            {/* Display Report Issue title */}
            <div className="header-center">
              <h2 className="dashboard-header">Report Issue</h2>
            </div>
            {/* Display Home button */}
            <div className="header-right">
              <div
                className="cart-icon-container"
                onClick={() => navigate("/admin/dashboard")}
              >
                <FaHome className="cart-icon" />
              </div>
            </div>
          </div>

          {/* Form to submit feedback */}
          <div className="report-issue-page">
            <form onSubmit={handleSubmit} className="feedback-form">
              <label>Email</label>
              <input 
                type="text" 
                name="email" 
                value={email} 
                onChange={(e) => {setEmail(e.target.value)}} 
                placeholder="Enter email..."
              />
              <label>Feedback</label>
              <textarea 
                name="feedback" 
                value={feedback} 
                onChange={(e) => {setFeedback(e.target.value)}}
                rows="10" 
                cols="5" 
                placeholder="Give your feedback..."
              /> 
              <button className="submit-button" type="submit">Submit</button>
            </form>
          </div>
        </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../contexts/AuthContext"; 
import "./LogoutButton.css";

const LogoutButton = () => {
  const { logout } = useAuth(); // Get the logout function from context
  const navigate = useNavigate(); // Hook to navigate to other routes

  const handleLogout = async () => {
    console.log("Logging out...");
    logout(); 
    console.log("Redirecting to login...");
    navigate("/"); // Redirect to the Home page
  };

  return (
    // Button that triggers logout
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button> // Button triggers the logout function
  );
};

export default LogoutButton;

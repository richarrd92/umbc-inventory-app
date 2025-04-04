import { useNavigate } from "react-router-dom"; // Import Navigate for redirection
import { useAuth } from "../contexts/AuthContext"; // Import Auth context to access logout

const LogoutButton = () => {
  const { logout } = useAuth(); // Get the logout function from context
  const navigate = useNavigate(); // Hook to navigate to other routes

  const handleLogout = () => {
    console.log("Logging out...");
    logout(); // Call the logout function to clear user session
    console.log("Redirecting to login...");
    navigate("/login"); // Redirect to the login page
  };

  return (
    // Button that triggers logout
    <button onClick={handleLogout}>Logout</button> // Button triggers the logout function
  );
};

export default LogoutButton;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState(""); // Store username input
  const [password, setPassword] = useState(""); // Store password input
  const [error, setError] = useState(null); // Error message state
  const navigate = useNavigate(); // For redirecting after login

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(null); // Reset error state on new submission
    console.log("Submitting login request with", { username, password }); 
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        username,
        password,
      });

      // what's being returned from the backend
      console.log("Login response:", res.data);

      const { token, role, id } = res.data; // Get token, role, and id from response
      console.log("Extracted data:", { token, role, id }); 

      // Check if id is undefined
      if (!id) {
        console.error("User ID is missing from response!");
        setError("User ID is missing in the response.");
        return;
      }

      login({ token, role, id });

      // Redirect based on role
      if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password."); // Show error message
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <section className="login-section">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-card-inner">
            <h2 className="login-title">Login</h2>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

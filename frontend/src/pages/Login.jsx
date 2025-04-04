import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state on new submission
    console.log("Submitting login request with", { username, password }); // Log request data
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        username,
        password,
      });
      const { token, role } = res.data;
      login({ token, role });
      if (role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password.");
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Display error */}
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

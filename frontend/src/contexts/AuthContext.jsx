import { createContext, useContext, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// AuthProvider manages user authentication state
export const AuthProvider = ({ children }) => {
  // Initialize user state from local storage (if available)
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function: stores user data in state and local storage
  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // Logout function: clears user data from state and local storage
  const logout = () => {
    console.log("Logging out...");
    setUser(null); // Clear user state
    localStorage.removeItem("user"); // Remove user data from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication context
export const useAuth = () => useContext(AuthContext);

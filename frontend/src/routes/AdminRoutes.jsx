import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function AdminRoutes() {
  const { user, logout } = useAuth(); // Get the authenticated user
  const navigate = useNavigate(); // Hook to navigate to other routes

  // If no user or user is not an admin, redirect to login
  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  useEffect(() => {
    if (window.location.pathname === "/logout") {
      logout(); // Trigger logout when on the /logout route
      navigate("/login"); // Redirect to login after logout
    }
  }, [logout, navigate]); // The dependencies ensure that logout is only called when necessary

  return (
    <Routes>
      {/* Admin dashboard route */}
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Catch-all route to redirect any undefined paths to admin dashboard */}
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "./contexts/AuthContext";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage"; // Import HomePage
import Layout from "./components/Layout";
import PrivateRoute from "./routes/PrivateRoute"; // Import PrivateRoute

// AppRoutes component
export default function AppRoutes() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Redirect unauthenticated users to login page
  useEffect(() => {
    // If there's no currentUser, exit the effect early
    if (!currentUser) return;

    if (currentUser && !hasRedirected.current) {
      hasRedirected.current = true; // Ensure only one redirect happens
      if (
        currentUser.role === "student" &&
        window.location.pathname !== "/student/dashboard"
      ) {
        navigate("/student/dashboard", { replace: true });
      } else if (
        currentUser.role === "admin" &&
        window.location.pathname !== "/admin/dashboard"
      ) {
        navigate("/admin/dashboard", { replace: true });
      }
    }
  }, [currentUser, navigate]);

  console.log("****** Current user in AppRoutes:", currentUser);

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/student/dashboard/*"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentRoutes />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard/*"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminRoutes />
            </PrivateRoute>
          }
        />

        {/* Redirect unauthenticated users to login page */}
        {!currentUser && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Layout>
  );
}

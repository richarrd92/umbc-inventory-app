import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";
import Cart from "./pages/Cart";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {user ? (
        user.role === "student" ? (
          <>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/cart" element={<Cart />} /> {/* <-- Add this line */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        )
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

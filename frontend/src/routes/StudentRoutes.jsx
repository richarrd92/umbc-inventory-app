import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";
import Cart from "../pages/Cart";
import { useAuth } from "../contexts/AuthContext";

// Component for student-specific routes
export default function StudentRoutes() {
  const { user } = useAuth();

  // Redirect to login if no user or if the user is not a student
  if (!user || user.role !== "student") return <Navigate to="/login" />;

  return (
    <Routes>
      {/* Student Dashboard route */}
      <Route path="/dashboard" element={<StudentDashboard />} />
      {/* Cart route for adding/removing items */}
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import StudentRoutes from "./routes/StudentRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage"; // Import HomePage

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* HomePage route */}
      <Route path="/login" element={<Login />} /> {/* Login route */}
      {/* Conditional rendering based on user role */}
      {user ? (
        user.role === "student" ? (
          <Route path="/*" element={<StudentRoutes />} />
        ) : (
          <Route path="/*" element={<AdminRoutes />} />
        )
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

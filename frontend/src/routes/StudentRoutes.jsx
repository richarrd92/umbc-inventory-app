import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";
import Cart from "../pages/Cart";

// Component for student-specific routes
export default function StudentRoutes() {
  return (
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="cart" element={<Cart />} />
      </Routes>
  );
}
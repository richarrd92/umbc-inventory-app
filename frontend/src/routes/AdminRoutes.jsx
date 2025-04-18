import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import Cart from "../pages/Cart";

// Component for admin-specific routes
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="cart" element={<Cart />} />
    </Routes>
  );
}

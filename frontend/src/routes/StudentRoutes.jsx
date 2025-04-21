import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";
import Cart from "../pages/Cart";
import FavoritesPage from "../pages/student/FavoritesPage";
import TransactionsPage from "../pages/student/TransactionsPage";
import ReportIssuePage from "../pages/ReportIssuePage"; // shared page btn admins and students

// Component for student-specific routes
export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="transactions" element={<TransactionsPage />} />
      <Route path="report-issue" element={<ReportIssuePage />} />
      <Route path="cart" element={<Cart />} />
    </Routes>
  );
}
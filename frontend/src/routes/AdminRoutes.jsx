import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import AddItemPage from "../pages/admin/AddItemPage";
import FavoritesPage from "../pages/admin/FavoritesPage";
import PastTransactionsPage from "../pages/admin/PastTransactionsPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";
import GenerateRestockPage from "../pages/admin/GenerateRestockPage";
import PastRestockPage from "../pages/admin/PastRestockPage";
import TransactionReportPage from "../pages/admin/TransactionReportPage";
import ExportCVPage from "../pages/admin/ExportCVPage";
import ReportIssuePage from "../pages/ReportIssuePage"; // shared page btn admins and students
import Cart from "../pages/Cart";

// Component for admin-specific routes
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="add-item" element={<AddItemPage />} />
      <Route path="edit-item/:itemId" element={<AddItemPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="transactions" element={<PastTransactionsPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="restock" element={<GenerateRestockPage />} />
      <Route path="restock/:orderId" element={<GenerateRestockPage />} />
      <Route path="past-restocks" element={<PastRestockPage />} />
      <Route path="transaction-report" element={<TransactionReportPage />} />
      <Route path="export-cv" element={<ExportCVPage />} />
      <Route path="report-issue" element={<ReportIssuePage />} />
      <Route path="cart" element={<Cart />} />
    </Routes>
  );
}

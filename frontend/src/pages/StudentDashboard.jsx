import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";
import { FaShoppingCart } from "react-icons/fa"; // Importing cart icon
import "./StudentDashboard.css";
import "./Pagination.css";

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of items per page

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get("http://localhost:8000/items", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);

      // Initialize quantity for each item to 0
      const initialQuantities = {};
      res.data.forEach((item) => {
        initialQuantities[item.id] = 0;
      });
      setQuantities(initialQuantities);
    };
    fetchItems();
  }, [user.token]);

  // Calculate the current items to be displayed based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages dynamically
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleQuantityChange = (itemId, newQty) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, newQty), // prevent negatives
    }));
  };

  const handleFinishCheckout = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([id, qty]) => qty > 0)
      .map(([id, qty]) => ({ id: parseInt(id), quantity: qty }));

    console.log("Items for checkout:", selectedItems);

    // TODO: send `selectedItems` to backend
    alert("Checkout submitted! (Functionality coming soon)");
  };

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-container">
        <h2 className="dashboard-header">Available Items</h2>
        <FaShoppingCart className="cart-icon" />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px", width: "60%" }}>
              Item
            </th>
            <th style={{ textAlign: "center", padding: "10px", width: "20%" }}>
              Available
            </th>
            <th style={{ textAlign: "center", padding: "10px", width: "20%" }}>
              Checkout
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "10px", width: "60%" }}>{item.name}</td>
              <td style={{ textAlign: "center", width: "20%" }}>
                {item.quantity}
              </td>
              <td style={{ textAlign: "center", width: "20%" }}>
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  value={quantities[item.id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  style={{ width: "45px", padding: "2px" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* Display current page and total pages */}
        <span className="page-info">
          {currentPage} / {totalPages} 
        </span>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="button-container">
        <LogoutButton />
        <button className="finish-button" onClick={handleFinishCheckout}>
          Check Out
        </button>
      </div>
    </div>
  );
}

// src/pages/AdminDashboard.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useAuth(); // Get authenticated user

  // Handle form submission to add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/items",
        {
          name,
          description,
          quantity: parseInt(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Send auth token
          },
        }
      );
      alert("Item added!");
      setName("");
      setDescription("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {/* Logout Button */}
      {/* <button onClick={LogoutButton}>Logout</button> */}
      <LogoutButton />
      {/* Item submission form */}
      <form onSubmit={handleSubmit}>
        <label>Item Name:</label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <label>Description:</label>
        <br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />

        <label>Quantity:</label>
        <br />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <br />

        {/* Submit button */}
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

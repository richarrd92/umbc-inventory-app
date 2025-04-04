// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

// Home page component shown at the root route "/"
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Inventory App</h1>
      <p>To get started, please log in</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

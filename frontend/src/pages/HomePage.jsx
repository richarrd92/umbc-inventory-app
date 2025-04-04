import React from "react";
import Header from "../components/Header";
import SubHeader from '../components/SubHeader';
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>

      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>
          Welcome to the Retriever Essentials Inventory App!
        </h1>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#ffb81c", // UMBC gold
            color: "black",
            borderRadius: "5px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Go to Login
        </Link>
      </main>
    </div>
  );
};

export default HomePage;

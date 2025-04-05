import React from "react";
import SubHeader from "../components/SubHeader";
import "./HomePage.css";
import Login from "./Login";

const HomePage = () => {
  return (
    <div className="home-page">
        <main>
          <Login />
        </main>
    </div>
  );
};

export default HomePage;

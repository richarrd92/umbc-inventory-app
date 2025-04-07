import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import SubHeader from "./SubHeader";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <SubHeader title={"Retriever Essentials Inventory App"} />
      <main >{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

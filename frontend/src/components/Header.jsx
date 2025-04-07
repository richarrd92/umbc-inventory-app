import React from "react";
import "./Header.css";
import umbcLogo from "../assets/UMBC-primary-logo.png";
import retrieverLogo from "../assets/Retriever-Essentials-Logo-300x237.png";

const Header = () => {
  return (
    <header className="umbc-header">
      <div className="umbc-topbar">
        <a
          href="https://www.umbc.edu"
          className="umbc-logo-wrapper"
          aria-label="UMBC"
        >
          <img src={umbcLogo} alt="UMBC Logo" className="umbc-logo" />
        </a>

        <img
          src={retrieverLogo}
          alt="Retriever Essentials Logo"
          className="retriever-logo"
        />
      </div>
      {/* moved the links to the footer */}

      
      {/* <div className="umbc-bottom-bar">
        <nav className="umbc-nav">
          <ul>
            <li><a href="https://www.facebook.com/umbcpage">Facebook</a></li>
            <li><a href="https://twitter.com/umbc">Twitter</a></li>
            <li><a href="https://www.instagram.com/umbclife/">Instagram</a></li>
            <li><a href="https://www.youtube.com/user/UMBCtube/">YouTube</a></li>
            <li><a href="https://www.linkedin.com/school/university-of-maryland-baltimore-county/mycompany/">LinkedIn</a></li>
            <li><a href="https://my.umbc.edu">myUMBC</a></li>
          </ul>
        </nav>
        {/* <h1 className="retriever-title">Retriever Essentials Inventory</h1> */}
      {/* </div> */} 
    </header>
  );
};

export default Header;

import React from "react";
import "./Footer.css";
import umbcLogo from "../assets/UMBC-primary-logo.png";
import retrieverLogo from "../assets/Retriever-Essentials-Logo-300x237.png";

const Footer = () => {
  return (
    <footer className="umbc-footer">
      <div className="umbc-footer-top">
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

      <div className="umbc-footer-bottom">
        <nav className="umbc-footer-nav">
          <ul>
            <li>
              <a href="https://www.facebook.com/umbcpage">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com/umbc">Twitter</a>
            </li>
            <li>
              <a href="https://www.instagram.com/umbclife/">Instagram</a>
            </li>
            <li>
              <a href="https://www.youtube.com/user/UMBCtube/">YouTube</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/school/university-of-maryland-baltimore-county/mycompany/">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://my.umbc.edu">myUMBC</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="umbc-footer-copyright">
        <p>
          &copy; {new Date().getFullYear()} University of Maryland, Baltimore
          County. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

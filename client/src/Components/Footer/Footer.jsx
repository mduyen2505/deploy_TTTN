import React from "react";
import "./Style.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Thông tin công ty */}
        <div className="footer-column">
          <h2 className="footer-logo">
            Glowify <span className="bold-text">Cosmestic </span>
          </h2>
          <p className="footer-description">
            Discover nature's beauty with our natural care products.
          </p>
          <div className="footer-contact">
            <p>📞 +84 843604370</p>
            <p>✉️ glowify@gmail.com</p>
            <p>📍 18A Cộng Hòa, Tân Bình, HCMHCM</p>
          </div>
        </div>

        {/* Cột 2: About */}
        <div className="footer-column">
          <h3>ABOUT</h3>
          <ul>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms & Conditions</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: My Account */}
        <div className="footer-column">
          <h3>MY ACCOUNT</h3>
          <ul>
            <li>
              <a href="/order-status">Order Status</a>
            </li>
            <li>
              <a href="/rewards">Rewards</a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Customer Care */}
        <div className="footer-column">
          <h3>CUSTOMER CARE</h3>
          <ul>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/shipping">Shipping Information</a>
            </li>
            <li>
              <a href="/contact">Contact us</a>
            </li>
            <li>
              <a href="/returns">Returns & Exchanges</a>
            </li>
          </ul>
        </div>

        {/* Cột 5: Đăng ký email */}
        <div className="footer-column">
          <h3>SIGN UP FOR EMAILS</h3>
          <p>Stay informed, subscribe to our newsletter now!</p>
          <input type="email" placeholder="Email" className="footer-input" />
          <a href="/subscribe" className="subscribe-link">
            Subscribe →
          </a>
        </div>
      </div>

      {/* Dòng bản quyền & icon mạng xã hội */}
      <div className="footer-bottom">
        <p>© 2025 Glowify</p>
        <div className="footer-socials">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            📘
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            🐦
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            📸
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

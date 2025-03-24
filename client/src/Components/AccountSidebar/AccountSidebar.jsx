import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import "./AccountSidebar.css";

const AccountSidebar = () => {
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="account-sidebar">
      <h2 className="account-sidebar-title">Account</h2>
      <ul className="account-sidebar-menu">
        {/* Contact Information */}
        <li className={`account-sidebar-item ${location.pathname === "/account" ? "active" : ""}`}>
          <Link to="/account" className="account-sidebar-link">Contact information</Link>
        </li>

        {/* Change Password */}
        <li className={`account-sidebar-item ${location.pathname === "/change-password" ? "active" : ""}`}>
          <Link to="/change-password" className="account-sidebar-link">Change password</Link>
        </li>

        {/* Orders Dropdown */}
        <li className="account-dropdown">
          <div className="account-dropdown-header" onClick={toggleOrderDropdown}>
            <span>Orders</span>
            <FontAwesomeIcon
              icon={isOrderDropdownOpen ? faAngleUp : faAngleDown}
              className={`account-dropdown-icon ${isOrderDropdownOpen ? "rotate" : ""}`}
            />
          </div>
          <ul className={`account-dropdown-menu ${isOrderDropdownOpen ? "show" : ""}`}>
            <li className={`account-dropdown-item ${location.pathname === "/orderslist" ? "active" : ""}`}>
              <Link to="/orderslist" className="account-dropdown-link">All Orders</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/pending" ? "active" : ""}`}>
              <Link to="/orders/pending" className="account-dropdown-link">Pending</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/confirmed" ? "active" : ""}`}>
              <Link to="/orders/confirmed" className="account-dropdown-link">Confirmed</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/shipped" ? "active" : ""}`}>
              <Link to="/orders/shipped" className="account-dropdown-link">Shipped</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/delivered" ? "active" : ""}`}>
              <Link to="/orders/delivered" className="account-dropdown-link">Delivered</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/cancelled" ? "active" : ""}`}>
              <Link to="/orders/cancelled" className="account-dropdown-link">Cancelled</Link>
            </li>
            <li className={`account-dropdown-item ${location.pathname === "/orders/returned" ? "active" : ""}`}>
              <Link to="/orders/returned" className="account-dropdown-link">Returned</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default AccountSidebar;

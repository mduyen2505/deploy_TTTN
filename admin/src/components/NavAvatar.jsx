import React, { useState } from "react";
import profileImg from "../images/wukong.jpg";

function NavAvatar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <li className="nav-item dropdown pe-3">
        <a
          className="nav-link nav-profile d-flex align-items-center pe-0"
          href="#"
          data-bs-toggle="dropdown"
        >
          <img src={profileImg} alt="Profile" className="rounded-circle" />
          <span className="d-none d-md-block dropdown-toggle ps-2">VanManh</span>
        </a>

        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
          <li className="dropdown-header">
            <h6>Hello</h6>
            <span>Web Developer</span>
          </li>
          <li><hr className="dropdown-divider" /></li>

          <li>
            <a
              className="dropdown-item d-flex align-items-center"
              href="#"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-person"></i>
              <span>My Profile</span>
            </a>
          </li>
          <li><hr className="dropdown-divider" /></li>

          <li>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <i className="bi bi-gear"></i>
              <span>Account Settings</span>
            </a>
          </li>
          <li><hr className="dropdown-divider" /></li>

          <li>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <i className="bi bi-box-arrow-right"></i>
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Hiển thị Modal khi nhấn vào "My Profile" */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Admin Profile</h2>
            <img src={profileImg} alt="Profile" className="profile-img" />
            <p><strong>Name:</strong> VanManh</p>
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Role:</strong> Web Developer</p>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default NavAvatar;

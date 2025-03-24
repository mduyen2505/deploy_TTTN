import React from "react";
import "./OrderPage.css"; // Import CSS

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        {children}
        <button className="modal-close" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Modal;

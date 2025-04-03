import React from "react";
import "../styles/Modal.css";

/**
 * Modal Component
 * This component is used to display a modal dialog with a title and content, with a close button.
 * @param show
 * @param onClose
 * @param title
 * @param children
 * @returns {JSX.Element|null}
 * @constructor
 */
const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;
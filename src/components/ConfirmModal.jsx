import React from "react";
import "../styles/ConfirmModal.css";

const ConfirmModal = ({ show, onClose, onConfirm, text }) => {
  if (!show) return null;

  return (
    <div className="modal-confirm">
      <div className="modal-content">
        <h2>Confirm Action</h2>
        <p>{text}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">Yes</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
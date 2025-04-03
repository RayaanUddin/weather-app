import React from "react";
import "../styles/ConfirmModal.css";

/**
 * ConfirmModal Component
 * This component is used to display a confirmation modal dialog with a message and two buttons: "Yes" and "No".
 * @param show
 * @param onClose
 * @param onConfirm
 * @param text
 * @returns {JSX.Element|null}
 * @constructor
 */
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
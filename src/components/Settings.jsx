import React, { useState } from "react";
import * as unitConversion from "../utils/unitConversion";
import ConfirmModal from "./ConfirmModal";
import {useErrorHandler} from "../utils/errorHandler";

/**
 * Settings Component
 * This component is used to display the settings page of the application.
 * It allows the user to select which metrics to display and change the unit of measurement.
 * It also provides a button to clear the local storage.
 * It is part of the side panel.
 * @param selectedMetricsToDisplay
 * @param setSelectedMetricsToDisplay
 * @param unit
 * @param setUnit
 * @returns {JSX.Element}
 * @constructor
 */
const Settings = ({ selectedMetricsToDisplay, setSelectedMetricsToDisplay, unit, setUnit }) => {
  const [tempMetrics, setTempMetrics] = useState({ ...selectedMetricsToDisplay });
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);
  const [showModal, setShowModal] = useState(false);

  //Function to store what checkboxes are currently checked
  const handleCheckboxChange = (option, value) => {
    setTempMetrics((prev) => ({ ...prev, [option]: value }));
  };

  //Function to check if checkboxes are valid and save the state if they are.
  const applyMetricSettings = () => {
    const numOfSelected = Object.values(tempMetrics).filter(Boolean).length;
    if (numOfSelected === 4) {
      setSelectedMetricsToDisplay({ ...tempMetrics });
      localStorage.setItem("metrics", JSON.stringify(tempMetrics));
    } else {
      handleError('You must select exactly four metrics to display!');
    }
  };

  return (
    <div className="settings-page">
      <div className="display-meters">
        <h4>Display Settings</h4>
        <form>
          {Object.keys(selectedMetricsToDisplay).map((metric) => (
            <div key={metric}>
              <input type="checkbox" id={metric} checked={tempMetrics[metric]} onChange={(e) => handleCheckboxChange(metric, e.target.checked)} />
              <label htmlFor={metric}>{metric}</label>
            </div>
          ))}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="button" onClick={applyMetricSettings} className={`toggle-button ${flashRed ? "flash-red" : ""}`}>Apply</button>
        </form>
      </div>
      <div className="change-metrics">
        <h4>Change Metrics</h4>
        {Object.values(unitConversion.UnitType).map((unitType) => (
          <React.Fragment key={unitType}>
            <input type="radio" id={unitType} name="choice" onChange={() => setUnit(unitType)} value={unitType} checked={unit === unitType} />
            <label htmlFor={unitType}>{unitType.charAt(0).toUpperCase() + unitType.slice(1)}</label><br />
          </React.Fragment>
        ))}
      </div>
      <button type="button" onClick={() => setShowModal(true)} className={"toggle-button"}>Clear Storage</button>
      <ConfirmModal
        show={showModal}
        text={"Are you sure you want to clear all data?"}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Settings;
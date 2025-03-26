import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBars, faLocation } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { getCurrentCoords } from "../utils/getCurrentCoords";
import { useErrorHandler } from "../utils/errorHandler";
import "../styles/Header.css";

const Header = ({ toggleMenu, isOpen, setCoords }) => {
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);

  const handleGetCurrentLocation = () => {
    getCurrentCoords().then(coords => {
      if (coords) {
        setCoords(coords);
      } else {
        handleError("Could not retrieve location.");
      }
    });
  };

  return (
    <>
      <header>
        <button onClick={toggleMenu} className="menu-button" aria-label="Open menu">
          <FontAwesomeIcon icon={!isOpen ? faBars : faArrowLeft} className="menu-icon" />
        </button>
        <button
          onClick={handleGetCurrentLocation}
          className={`menu-button ${flashRed ? "flash-red" : ""}`}
          aria-label="Get current location"
        >
          <FontAwesomeIcon icon={faLocation} className="get-current-location" style={{ paddingRight: 5 }} />
          Current Location
        </button>
      </header>
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default Header;
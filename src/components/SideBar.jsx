import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { locationCoords } from "../api/location";
import { fetchCurrentForecast } from "../api/forecast";
import * as unitConversion from "../utils/unitConversion";
import LocationWeather from "./LocationWeather";
import { useErrorHandler } from "../utils/errorHandler";
import ConfirmModal from "./ConfirmModal";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = ({ setCoords, unit, setUnit, toggleMenu }) => {
  const [inputLocation, setInputLocation] = useState("");
  const [showChangeLocation, setShowChangeLocation] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);
  const [showSettings, setShowSettings] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedLocations);
  }, []);

  useEffect(() => {
    const fetchForecasts = async () => {
      const results = await Promise.all(
        searchHistory.map(async (location) => {
          try {
            const response = await fetchCurrentForecast(location);
            return { location, forecast: response.data };
          } catch (error) {
            console.error(`Error fetching forecast for ${location}:`, error);
            const updatedHistory = searchHistory.filter((item) => item !== location);
            setSearchHistory(updatedHistory);
            localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
            return { location, forecast: null };
          }
        })
      );

      const forecastsObject = results.reduce((acc, item) => {
        acc[item.location] = item.forecast;
        return acc;
      }, {});

      setForecasts(forecastsObject);
    };

    if (searchHistory.length > 0) {
      fetchForecasts();
    }
  }, [searchHistory]);

  const handleLocationSearch = async () => {
    if (inputLocation.trim() !== "") {
      const [success, coords] = await locationCoords(inputLocation);
      if (success) {
        setCoords(coords);
        toggleMenu();

        if (!searchHistory.includes(inputLocation)) {
          const updatedHistory = [inputLocation, ...searchHistory].slice(0, 5);
          setSearchHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        }
      } else {
        handleError("Could not retrieve location.");
        console.error("Geocoding error:", inputLocation);
      }
    }
  };

  const handleHistorySearch = async (location) => {
    const [success, coords] = await locationCoords(location);
    if (success) {
      setCoords(coords);
      toggleMenu();
    } else {
      console.error("Geocoding error:", location);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container">
      <button onClick={() => setShowChangeLocation(!showChangeLocation)} className="toggle-button">
        Change Location
        <FontAwesomeIcon icon={faCaretDown}  className= {showChangeLocation ? "caret-icon icon180" : "caret-icon"} />
      </button>
      {showChangeLocation && (
        <div className="location-search">
          <div className="location-component">
            <input
              type="text"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              placeholder="Enter location"
              className={`menu-button ${flashRed ? "flash-red" : ""}`}
            />
            {error && <p className="error-message">{error}</p>}
            <button onClick={handleLocationSearch}>Search</button>
          </div>
          <h4>Previous Searches</h4>
          <div className="previous-locations">
            {searchHistory.map((location, index) => (
              forecasts[location] ?
                <LocationWeather forecast={forecasts[location]} key={index} unit={unit} onClick={() => handleHistorySearch(location)} />
                : <button key={index} onClick={() => handleHistorySearch(location)}>loading...</button>
            ))}
          </div>
        </div>
      )}
      <button>Select a Route</button>
      <button onClick={() => setShowSettings(!showSettings)} className="toggle-button">
        Settings
        <FontAwesomeIcon icon={faCaretDown}  className= {showSettings ? "caret-icon icon180" : "caret-icon"} />
      </button>
      {showSettings && (
        <div className="settings-page">
          <div className="change-metrics">
            <h4>Change Metrics</h4>
            {
              Object.values(unitConversion.UnitType).map((unitType) => (
                <React.Fragment key={unitType}>
                  <input type="radio" id={unitType} name="choice" onChange={() => setUnit(unitType)} value={unitType} checked={unit === unitType} />
                  <label htmlFor={unitType}>{unitType.charAt(0).toUpperCase() + unitType.slice(1)}</label><br />
                </React.Fragment>
              ))
            }
          </div>
          <div className="clear-storage">
            <h4>Clear Data</h4>
            <button onClick={() => setShowModal(true)}>Clear</button>
          </div>
        </div>
      )}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={clearStorage}
      />
    </div>
  );
};

export default SideBar;
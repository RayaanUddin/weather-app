import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { fetchCurrentForecast } from "../api/forecast";
import LocationSearch from "./LocationSearch";
import Settings from "./Settings";
import ConfirmModal from "./ConfirmModal";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = ({ selectedMetricsToDisplay, setSelectedMetricsToDisplay, setCoords, unit, setUnit, toggleMenu }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedLocations);
  }, []);

  useEffect(() => {
    const fetchForecasts = async () => {
      const results = await Promise.all(
        searchHistory.map(async (coords) => {
          try {
            const response = await fetchCurrentForecast(coords);
            return { coords, forecast: response.data };
          } catch (error) {
            console.error(
              `Error fetching forecast for coords ${coords.lat}, ${coords.lon}:`,
              error
            );
            const updatedHistory = searchHistory.filter(
              (item) => item.lat !== coords.lat || item.lon !== coords.lon
            );
            setSearchHistory(updatedHistory);
            localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
            return { coords, forecast: null };
          }
        })
      );

      const forecastsObject = results.reduce((acc, item) => {
        const key = `${item.coords.lat}, ${item.coords.lon}`;
        acc[key] = item.forecast;
        return acc;
      }, {});

      setForecasts(forecastsObject);
    };

    fetchForecasts();
  }, [searchHistory]);

  return (
    <div className="container">
      <button onClick={() => setShowLocationSearch(!showLocationSearch)} className="toggle-button">
        Change Location
        <FontAwesomeIcon icon={faCaretDown} className={showLocationSearch ? "caret-icon icon180" : "caret-icon"} />
      </button>
      {showLocationSearch && (
        <LocationSearch
          setCoords={setCoords}
          toggleMenu={toggleMenu}
          unit={unit}
          forecasts={forecasts}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
        />
      )}
      <button onClick={() => setShowRoute(!showRoute)} className="toggle-button">
        Change Route
        <FontAwesomeIcon icon={faCaretDown} className={showRoute ? "caret-icon icon180" : "caret-icon"} />
      </button>
      <button onClick={() => setShowSettings(!showSettings)} className="toggle-button">
        Settings
        <FontAwesomeIcon icon={faCaretDown} className={showSettings ? "caret-icon icon180" : "caret-icon"} />
      </button>
      {showSettings && (
        <Settings
          selectedMetricsToDisplay={selectedMetricsToDisplay}
          setSelectedMetricsToDisplay={setSelectedMetricsToDisplay}
          unit={unit}
          setUnit={setUnit}
        />
      )}
    </div>
  );
};

export default SideBar;
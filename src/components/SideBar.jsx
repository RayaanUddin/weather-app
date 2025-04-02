import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { fetchCurrentForecast } from "../api/forecast";
import LocationSearch from "./LocationSearch";
import Settings from "./Settings";
import ConfirmModal from "./ConfirmModal";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Routing from "./Routing"
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
      fetchForecasts().then(results => {
        console.log("Fetched forecasts for history:", results);
      });
    }
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
      {
        showRoute && <Routing/>
      }
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
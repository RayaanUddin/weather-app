import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { fetchCurrentForecast } from "../api/forecast";
import LocationSearch from "./LocationSearch";
import Settings from "./Settings";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Routing from "./Routing"

/**
 * SideBar Component
 * This component is used to display the sidebar of the application.
 * It includes buttons to change location, settings, and routing.
 * @param selectedMetricsToDisplay
 * @param setSelectedMetricsToDisplay
 * @param setCoords
 * @param unit
 * @param setUnit
 * @param toggleMenu
 * @param setRoute
 * @param start
 * @param end
 * @param setStart
 * @param setEnd
 * @param coords
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = ({ selectedMetricsToDisplay, setSelectedMetricsToDisplay, setCoords, unit, setUnit, toggleMenu,setRoute,start,end,setStart,setEnd,coords }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [forecasts, setForecasts] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  // Get search history from local storage
  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedLocations);
  }, []);

  // Get forecast of search history. If error occurs, remove the location from search history.
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

      // Key the forecasts by their coordinates
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
      {showLocationSearch && ( // Show location search when button clicked
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
      { showRoute && (// Show routing when button clicked
        <Routing
          setRoute={setRoute}
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
        />
      )}
      <button onClick={() => setShowSettings(!showSettings)} className="toggle-button">
        Settings
        <FontAwesomeIcon icon={faCaretDown} className={showSettings ? "caret-icon icon180" : "caret-icon"} />
      </button>
      {showSettings && ( // Show settings when button clicked
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